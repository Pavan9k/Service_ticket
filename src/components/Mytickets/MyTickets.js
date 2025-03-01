import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./mytickets.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";

function MyTickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [student, setStudent] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [ticketDescription, setTicketDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [ticketCategory, setTicketCategory] = useState("Management");
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("studentUser"));
        if (storedUser) {
            setStudent(storedUser);
            fetchTickets(storedUser.id);
        } else {
            navigate("/");
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

        const newTicket = {
            ticketId: Date.now().toString(),
            ticket: ticketDescription,
            ticketStatus: "open",
            imageName: selectedImage ? selectedImage.name : null,
            category: ticketCategory,
            dateSubmitted: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
        };

        try {
            const response = await axios.get(`http://localhost:8000/Student/${student.id}`);
            const updatedStudent = { ...response.data };

            updatedStudent.tickets = [...(updatedStudent.tickets || []), newTicket];

            await axios.put(`http://localhost:8000/Student/${student.id}`, updatedStudent);

            setTickets(updatedStudent.tickets);
            setShowCreateModal(false);
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

    return (
        <div className={styles.container}>
            <h2>My Tickets</h2>
            <p>Welcome, {student?.name}. Here are your submitted tickets:</p>

            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create New Ticket
            </Button>

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
                            <tr key={ticket.ticketId} onClick={() => setSelectedTicket(ticket)} className={styles.ticketRow}>
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.ticket}</td>
                                <td>{ticket.category}</td>
                                <td>
                                    {ticket.imageName ? (
                                        <img
                                            src={getImageSrc(ticket.imageName)}
                                            alt={`Ticket ${ticket.ticketId}`}
                                            className={styles.ticketImage}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `${process.env.PUBLIC_URL}/images/default.png`;
                                            }}
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td className={
                                    ticket.ticketStatus === "closed" ? styles.closed :
                                    ticket.ticketStatus === "in-progress" ? styles.inProgress :
                                    styles.open
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

            {/* Create Ticket Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="ticketDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={ticketDescription}
                                onChange={(e) => setTicketDescription(e.target.value)}
                                placeholder="Enter ticket description"
                            />
                        </Form.Group>

                        <Form.Group controlId="ticketCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                value={ticketCategory}
                                onChange={(e) => setTicketCategory(e.target.value)}
                            >
                                <option>Management</option>
                                <option>IT</option>
                                <option>Cleaning</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="ticketImage">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} />
                            {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitTicket}>
                        Submit Ticket
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Ticket Details Modal */}
            <Modal show={selectedTicket !== null} onHide={() => setSelectedTicket(null)} centered animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Ticket Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTicket && (
                        <>
                            <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
                            <p><strong>Description:</strong> {selectedTicket.ticket}</p>
                            <p><strong>Category:</strong> {selectedTicket.category}</p>
                            <p><strong>Status:</strong> {selectedTicket.ticketStatus}</p>
                            <p><strong>Date Submitted:</strong> {selectedTicket.dateSubmitted}</p>
                            <p><strong>Feedback:</strong> {selectedTicket.feedback || "No Feedback"}</p>
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

export default MyTickets;
