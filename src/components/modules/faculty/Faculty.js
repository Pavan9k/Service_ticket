import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from './faculty.module.css';

const API_BASE_URL = 'http://localhost:8000/Student';

function Faculty() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [faculty, setFaculty] = useState(null);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Management');

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
                student.tickets.map(ticket => ({ ...ticket, studentId: student.id }))
            );
            setTickets(allTickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError('Failed to load tickets. Please try again.');
        }
    };

    const handleStatusChange = async (ticketId, studentId, newStatus) => {
        try {
            const { data: studentData } = await axios.get(`${API_BASE_URL}/${studentId}`);
            
            const updatedTickets = studentData.tickets.map(ticket =>
                ticket.ticketId === ticketId ? { ...ticket, ticketStatus: newStatus } : ticket
            );

            await axios.put(`${API_BASE_URL}/${studentId}`, { ...studentData, tickets: updatedTickets });

            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.ticketId === ticketId ? { ...ticket, ticketStatus: newStatus } : ticket
                )
            );
        } catch (error) {
            console.error('Error updating ticket status:', error);
            setError('Could not update ticket status. Try again.');
        }
    };

    const handleFeedbackClick = (ticket) => {
        setSelectedTicket(ticket);
        setFeedback(ticket.feedback || ''); // Prefill if feedback exists
        setShowFeedbackModal(true);
    };

    const handleFeedbackSubmit = async (ticketId, studentId) => {
        try {
            const { data: studentData } = await axios.get(`${API_BASE_URL}/${studentId}`);

            const updatedTickets = studentData.tickets.map(ticket =>
                ticket.ticketId === ticketId ? { ...ticket, feedback } : ticket
            );

            await axios.put(`${API_BASE_URL}/${studentId}`, { ...studentData, tickets: updatedTickets });

            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.ticketId === ticketId ? { ...ticket, feedback } : ticket
                )
            );

            setShowFeedbackModal(false);
            setFeedback('');
            alert('Feedback submitted successfully!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('Could not submit feedback. Try again.');
        }
    };

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setShowDetailsModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTicket(null);
        setShowDetailsModal(false);
    };

    const filterTicketsByCategory = (category) => {
        return tickets.filter(ticket => ticket.category === category);
    };

    return (
        <div className={styles.container}>
            <h2>Faculty Ticket Management</h2>
            {faculty && <p>Welcome, {faculty.name}. You can review and update ticket statuses.</p>}

            {error && <p className={styles.error}>{error}</p>}

            {/* Category Selection */}
            <div className={styles.categoryContainer}>
                <div 
                    className={`${styles.categoryButton} ${selectedCategory === 'Management' ? styles.active : ''}`} 
                    onClick={() => setSelectedCategory('Management')}
                >
                    Management
                </div>
                <div 
                    className={`${styles.categoryButton} ${selectedCategory === 'IT' ? styles.active : ''}`} 
                    onClick={() => setSelectedCategory('IT')}
                >
                    IT
                </div>
                <div 
                    className={`${styles.categoryButton} ${selectedCategory === 'Cleaning' ? styles.active : ''}`} 
                    onClick={() => setSelectedCategory('Cleaning')}
                >
                    Cleaning
                </div>
            </div>

            {/* Ticket List */}
            {filterTicketsByCategory(selectedCategory).length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterTicketsByCategory(selectedCategory).map((ticket) => (
                            <tr key={ticket.ticketId} onClick={() => handleTicketClick(ticket)}>
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.ticket}</td>
                                <td>
                                    <Form.Select
                                        value={ticket.ticketStatus}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => handleStatusChange(ticket.ticketId, ticket.studentId, e.target.value)}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="closed">Closed</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    {ticket.ticketStatus === 'closed' && (
                                        <Button onClick={() => handleFeedbackClick(ticket)}>Feedback</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tickets available in this category.</p>
            )}

            {/* Feedback Modal */}
            <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Provide Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Feedback:</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={4} 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)} 
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => handleFeedbackSubmit(selectedTicket.ticketId, selectedTicket.studentId)}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Faculty;
