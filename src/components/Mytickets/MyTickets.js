import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './mytickets.module.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function MyTickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [student, setStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [ticketDescription, setTicketDescription] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('studentUser'));
        if (storedUser) {
            setStudent(storedUser);
            fetchTickets(storedUser.id);
        } else {
            navigate('/'); // Redirect if not logged in
        }
    }, [navigate]);

    const fetchTickets = async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:8000/Student/${studentId}`);
            setTickets(response.data.tickets || []);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const handleSubmitTicket = async () => {
        if (!ticketDescription.trim()) return;

        const newTicket = {
            ticketId: Date.now().toString(),
            ticket: ticketDescription,
            ticketStatus: 'open'
        };

        try {
            const response = await axios.get(`http://localhost:8000/Student/${student.id}`);
            const updatedStudent = { ...response.data };

            updatedStudent.tickets = [...(updatedStudent.tickets || []), newTicket];

            await axios.put(`http://localhost:8000/Student/${student.id}`, updatedStudent);

            setTickets(updatedStudent.tickets);
            setShowModal(false);
            setTicketDescription("");
        } catch (error) {
            console.error("Error updating tickets:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h2>My Tickets</h2>
            <p>Welcome, {student?.name}. Here are your submitted tickets:</p>

            {tickets.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.ticketId}>
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.ticket}</td>
                                <td className={ticket.ticketStatus === 'closed' ? styles.closed : styles.open}>
                                    {ticket.ticketStatus}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tickets found.</p>
            )}

            <div className={styles.buttonContainer}>
                <Button variant="success" onClick={() => setShowModal(true)}>
                    Create New Ticket
                </Button>
                <span className={styles.buttonSpacing} /> {/* Added space */}
                <Button variant="primary" onClick={() => navigate('/student')}>
                    Back to Dashboard
                </Button>
            </div>

            {/* Modal for Creating Tickets */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Ticket Description</Form.Label>
                            <Form.Control 
                                as="textarea" // Changed to textarea
                                rows={3} 
                                placeholder="Enter ticket details" 
                                value={ticketDescription} 
                                onChange={(e) => setTicketDescription(e.target.value)} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitTicket}>
                        Submit Ticket
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MyTickets;
