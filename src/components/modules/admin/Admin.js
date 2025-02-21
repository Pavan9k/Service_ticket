// Path: D:/React/Service/ticket/src/components/modules/admin/Admin.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Route, Routes } from 'react-router-dom';
import Analytics from './components/Analytics';
import UserManagement from './components/UserManagement';
import TicketManagement from './components/TicketManagement';
import Notifications from './components/Notifications';
import styles from './admin.module.css';

const API_BASE_URL = 'http://localhost:8000';

function Admin() {
    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [ticketStats, setTicketStats] = useState({
        open: 0,
        inProgress: 0,
        closed: 0,
        totalTickets: 0
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const studentResponse = await axios.get(`${API_BASE_URL}/Student`);
            setStudents(studentResponse.data);

            const facultyResponse = await axios.get(`${API_BASE_URL}/Faculty`);
            setFaculty(facultyResponse.data);

            // Calculate Ticket Stats
            const tickets = studentResponse.data.flatMap(student => student.tickets);
            const open = tickets.filter(ticket => ticket.ticketStatus === 'open').length;
            const inProgress = tickets.filter(ticket => ticket.ticketStatus === 'in-progress').length;
            const closed = tickets.filter(ticket => ticket.ticketStatus === 'closed').length;
            const totalTickets = tickets.length;

            setTicketStats({ open, inProgress, closed, totalTickets });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.topNav}>
                <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    Analytics
                </NavLink>
                <NavLink to="/admin/user-management" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    User Management
                </NavLink>
                <NavLink to="/admin/ticket-management" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    Ticket Management
                </NavLink>
                <NavLink to="/admin/notifications" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    Notifications
                </NavLink>
            </div>

            <h2 className={styles.title}>Admin Dashboard</h2>

            <div className={styles.content}>
                <Routes>
                    <Route path="analytics" element={<Analytics ticketStats={ticketStats} students={students} faculty={faculty} />} />
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="ticket-management" element={<TicketManagement />} />
                    <Route path="notifications" element={<Notifications />} />
                </Routes>
            </div>
        </div>
    );
}

export default Admin;
