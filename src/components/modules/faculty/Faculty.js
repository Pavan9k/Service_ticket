import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './faculty.module.css';

const API_BASE_URL = 'http://localhost:8000/Student';

function Faculty() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [faculty, setFaculty] = useState(null);
    const [error, setError] = useState('');

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

    return (
        <div className={styles.container}>
            <h2>Faculty Ticket Management</h2>
            {faculty && <p>Welcome, {faculty.name}. You can review and update ticket statuses.</p>}

            {error && <p className={styles.error}>{error}</p>}

            {tickets.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.ticketId}>
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.ticket}</td>
                                <td>
                                    <Form.Select
                                        value={ticket.ticketStatus}
                                        onChange={(e) => handleStatusChange(ticket.ticketId, ticket.studentId, e.target.value)}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="closed">Closed</option>
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tickets available.</p>
            )}

            <Button variant="primary" onClick={() => navigate('/')}>Logout</Button>
        </div>
    );
}

export default Faculty;
