import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from './TicketManagement.module.css';

function TicketManagement() {
    const [tickets, setTickets] = useState([]);
    const [sortedTickets, setSortedTickets] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'ticketId', direction: 'ascending' });
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const studentResponse = await axios.get('http://localhost:8000/Student');
                const allTickets = studentResponse.data.flatMap(student => student.tickets);
                setTickets(allTickets);
                setSortedTickets(allTickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    // Sorting Function with useMemo for performance optimization
    useMemo(() => {
        if (sortConfig.key) {
            setSorting(true);
            const sorted = [...sortedTickets].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            setSortedTickets(sorted);
            setSorting(false);
        }
    }, [sortConfig, tickets]);

    // Sorting Handler
    const sortTickets = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (column) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    // Function to map ticket status to background color
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'open':
                return '#FF6384';
            case 'in-progress':
                return '#FFCE56';
            case 'closed':
                return '#4BC0C0';
            default:
                return '#777';
        }
    };

    // Search Filter
    const filteredTickets = useMemo(() => {
        return sortedTickets.filter(ticket =>
            ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, sortedTickets]);

    // Date Formatter
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Format: dd-MM-yyyy
    };

    return (
        <div className={styles.section}>
            <h3>Ticket Management</h3>

            {/* Search Bar */}
            <input 
                type="text" 
                placeholder="Search by Ticket ID..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchBar}
            />

            {loading ? (
                <p>Loading tickets...</p>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.ticketTable}>
                        <thead>
                            <tr>
                                <th onClick={() => sortTickets('ticketId')}>
                                    Ticket ID {renderSortIcon('ticketId')}
                                </th>
                                <th onClick={() => sortTickets('ticket')}>
                                    Description {renderSortIcon('ticket')}
                                </th>
                                <th>Image</th>
                                <th onClick={() => sortTickets('ticketStatus')}>
                                    Status {renderSortIcon('ticketStatus')}
                                </th>
                                <th onClick={() => sortTickets('dateSubmitted')}>
                                    Date Submitted {renderSortIcon('dateSubmitted')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorting ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: '#777' }}>
                                        Sorting tickets...
                                    </td>
                                </tr>
                            ) : filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket, index) => (
                                    <tr key={index} onClick={() => setSelectedTicket(ticket)}>
                                        <td>{ticket.ticketId}</td>
                                        <td>{ticket.ticket}</td>
                                        <td>
                                            {ticket.imageName ? (
                                                <img 
                                                    src={`${process.env.PUBLIC_URL}/images/${ticket.imageName}`} 
                                                    alt="Ticket" 
                                                    className={styles.ticketImage}
                                                />
                                            ) : (
                                                "No Image"
                                            )}
                                        </td>
                                        <td 
                                            style={{ backgroundColor: getStatusColor(ticket.ticketStatus), color: '#fff' }}
                                        >
                                            {ticket.ticketStatus}
                                        </td>
                                        <td>{formatDate(ticket.dateSubmitted)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '10px', color: '#777' }}>
                                        No tickets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Ticket Details Modal */}
            <Modal show={selectedTicket !== null} onHide={() => setSelectedTicket(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ticket Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTicket && (
                        <>
                            <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
                            <p><strong>Description:</strong> {selectedTicket.ticket}</p>
                            <p><strong>Status:</strong> {selectedTicket.ticketStatus}</p>
                            <p><strong>Date Submitted:</strong> {formatDate(selectedTicket.dateSubmitted)}</p>
                            {selectedTicket.imageName && (
                                <img 
                                    src={`${process.env.PUBLIC_URL}/images/${selectedTicket.imageName}`} 
                                    alt="Ticket" 
                                    className={styles.modalImage}
                                />
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedTicket(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TicketManagement;
