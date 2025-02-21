import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../admin.module.css';

function TicketManagement() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const studentResponse = await axios.get('http://localhost:8000/Student');
                const allTickets = studentResponse.data.flatMap(student => student.tickets);
                setTickets(allTickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    return (
        <div className={styles.section}>
            <h3>Ticket Management</h3>
            {loading ? <p>Loading tickets...</p> : (
                <ul>
                    {tickets.map((ticket, index) => (
                        <li key={index}>{ticket.ticketTitle} - {ticket.ticketStatus}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TicketManagement;
