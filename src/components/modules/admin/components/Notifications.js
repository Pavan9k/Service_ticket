import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../admin.module.css';

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const studentResponse = await axios.get('http://localhost:8000/Student');
                const newTickets = studentResponse.data.flatMap(student => student.tickets.filter(ticket => ticket.ticketStatus === 'open'));
                setNotifications(newTickets);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className={styles.section}>
            <h3>Notifications & Alerts</h3>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>New Ticket: {notification.ticketTitle}</li>
                ))}
            </ul>
        </div>
    );
}

export default Notifications;