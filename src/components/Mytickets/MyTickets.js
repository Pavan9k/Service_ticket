import { useEffect, useState, useCallback } from 'react';
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
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [ticketCategory, setTicketCategory] = useState("Management"); // New state for category

    const [selectedTicket, setSelectedTicket] = useState(null);

    const [imageModal, setImageModal] = useState({
        isVisible: false,
        src: null
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('studentUser'));
        if (storedUser) {
            setStudent(storedUser);
            fetchTickets(storedUser.id);
        } else {
            navigate('/'); // Redirect if not logged in
        }
    }, [navigate]);

    const fetchTickets = useCallback(async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:8000/Student/${studentId}`);
            setTickets(response.data.tickets || []);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmitTicket = useCallback(async () => {
        if (!ticketDescription.trim()) return;
    
        let imageName = null;
    
        if (selectedImage) {
            imageName = selectedImage.name;
        }
    
        const newTicket = {
            ticketId: Date.now().toString(),
            ticket: ticketDescription,
            ticketStatus: 'open',
            imageName: imageName,
            category: ticketCategory,
            dateSubmitted: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        };
    
        try {
            const response = await axios.get(`http://localhost:8000/Student/${student.id}`);
            const updatedStudent = { ...response.data };
    
            updatedStudent.tickets = [...(updatedStudent.tickets || []), newTicket];
    
            await axios.put(`http://localhost:8000/Student/${student.id}`, updatedStudent);
    
            setTickets(updatedStudent.tickets);
            setShowModal(false);
            setTicketDescription("");
            setSelectedImage(null);
            setImagePreview(null);
            setTicketCategory("Management");
        } catch (error) {
            console.error("Error updating tickets:", error);
        }
    }, [ticketDescription, selectedImage, student, ticketCategory]);
        
    const getImageSrc = (imageName) => {
        return `${process.env.PUBLIC_URL}/images/${imageName}`;
    };

    const handleImageClick = useCallback((imageSrc) => {
        setImageModal({
            isVisible: true,
            src: imageSrc
        });
    }, []);

    const handleCloseImageModal = useCallback(() => {
        setImageModal({
            isVisible: false,
            src: null
        });
    }, []);

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseDetailsModal = () => {
        setSelectedTicket(null);
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
                            <th>Category</th>
                            <th>Image</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr 
                                key={ticket.ticketId} 
                                onClick={() => handleTicketClick(ticket)}
                                className={styles.ticketRow}
                            >
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.ticket}</td>
                                <td>{ticket.category}</td>
                                <td>
                                    {ticket.imageName ? (
                                        <img 
                                            src={getImageSrc(ticket.imageName)} 
                                            alt={`Ticket ${ticket.ticketId}`} 
                                            className={styles.ticketImage}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleImageClick(getImageSrc(ticket.imageName));
                                            }}
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = `${process.env.PUBLIC_URL}/images/default.png`; 
                                            }}
                                            tabIndex={0}
                                            role="button"
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td className={
                                    ticket.ticketStatus === 'closed' 
                                    ? styles.closed 
                                    : ticket.ticketStatus === 'in-progress' 
                                    ? styles.inProgress 
                                    : styles.open
                                }>
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
                <span className={styles.buttonSpacing} />
                <Button variant="primary" onClick={() => navigate('/student')}>
                    Back to Dashboard
                </Button>
            </div>

            {/* Create Ticket Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="ticketDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={ticketDescription} 
                            onChange={(e) => setTicketDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ticketCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Select 
                            value={ticketCategory} 
                            onChange={(e) => setTicketCategory(e.target.value)}
                        >
                            <option value="Management">Management</option>
                            <option value="IT">IT</option>
                            <option value="Cleaning">Cleaning</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ticketImage">
                        <Form.Label>Attach Image (Optional)</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                        )}
                    </Form.Group>
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
