import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import styles from './faculty.module.css';

const API_BASE_URL = 'http://localhost:8000/Student';

function Faculty() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [faculty, setFaculty] = useState(null);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [sortBy, setSortBy] = useState('ticketId');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedCategory, setSelectedCategory] = useState('Management');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('facultyUser'));
        if (!storedUser) {
            navigate('/'); // Redirect if not logged in
            return;
        }
        setFaculty(storedUser);
        fetchTickets();
    }, [navigate]);

    const fetchTickets = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            const allTickets = response.data.flatMap(student =>
                student.tickets.map(ticket => ({ ...ticket, studentId: student.id, studentName: student.name }))
            );
            setTickets(allTickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError('Failed to load tickets. Please try again.');
        }
    };

    const handleSort = (column) => {
        const order = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(order);
    };

    const handleStatusChange = async (ticket, newStatus) => {
        try {
            const { data: studentData } = await axios.get(`${API_BASE_URL}/${ticket.studentId}`);
            const updatedTickets = studentData.tickets.map(t =>
                t.ticketId === ticket.ticketId ? { ...t, ticketStatus: newStatus } : t
            );
            await axios.put(`${API_BASE_URL}/${ticket.studentId}`, { ...studentData, tickets: updatedTickets });
            setTickets(prevTickets =>
                prevTickets.map(t =>
                    t.ticketId === ticket.ticketId ? { ...t, ticketStatus: newStatus } : t
                )
            );
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    const filteredTickets = tickets
    .filter(ticket =>
        ticket.category === selectedCategory &&
        (ticket.ticketId.includes(searchQuery) ||
         ticket.ticket.toLowerCase().includes(searchQuery.toLowerCase()) ||
         ticket.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        if (sortOrder === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setShowDetailsModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTicket(null);
        setShowDetailsModal(false);
    };

    return (
        <div className={styles.container}>
            <h2>Faculty Ticket Management</h2>
            {faculty && <p>Welcome, {faculty.name}. You can review and update ticket statuses.</p>}

            {error && <p className={styles.error}>{error}</p>}

            {/* Search Bar */}
            <Form.Control
                type="text"
                placeholder="Search by Ticket ID, Description, or Student Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchBar}
            />

            {/* Category Tabs */}
            <Tabs activeKey={selectedCategory} onSelect={(k) => setSelectedCategory(k)} className="mb-3">
                <Tab eventKey="Management" title="Management" />
                <Tab eventKey="IT" title="IT" />
                <Tab eventKey="Cleaning" title="Cleaning" />
            </Tabs>

            {/* Ticket List */}
            {filteredTickets.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('ticketId')}>Ticket ID <span>{sortOrder === 'asc' ? '↑' :'↓'} </span></th>
                            <th onClick={() => handleSort('ticket')}>Description</th>
                            <th onClick={() => handleSort('ticketStatus')}>Status</th>
                            <th onClick={() => handleSort('studentName')}>Student</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.ticketId} onClick={(e) => {
                                if (e.target.tagName !== "SELECT") {
                                    handleTicketClick(ticket);
                                }
                            }}>
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.ticket}</td>
                                <td>
                                    <Form.Select
                                        value={ticket.ticketStatus}
                                        onChange={(e) => handleStatusChange(ticket, e.target.value)}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="closed">Closed</option>
                                    </Form.Select>
                                </td>
                                <td>{ticket.studentName}</td>
                                <td>
                                    {ticket.imageName ? (
                                        <img
                                            src={`${process.env.PUBLIC_URL}/images/${ticket.imageName}`}
                                            alt="Ticket"
                                            className={styles.ticketImage}
                                        />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tickets available in this category.</p>
            )}

            {/* Ticket Details Modal */}
            <Modal show={showDetailsModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ticket Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTicket && (
                        <>
                            <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
                            <p><strong>Student:</strong> {selectedTicket.studentName}</p>
                            <p><strong>Description:</strong> {selectedTicket.ticket}</p>
                            <p><strong>Status:</strong> {selectedTicket.ticketStatus}</p>
                            {selectedTicket.imageName && (
                                <div>
                                    <p><strong>Image:</strong></p>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/images/${selectedTicket.imageName}`}
                                        alt="Ticket"
                                        className={styles.modalImage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Faculty;
