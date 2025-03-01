import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './student.module.css';
import Button from 'react-bootstrap/Button';
import { FaBars, FaTimes, FaUserCircle, FaBullhorn, FaCog, FaQuestionCircle, FaTicketAlt } from 'react-icons/fa';

function Student() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('studentUser'));
        if (storedUser) {
            setStudent(storedUser);

            // Fetch tickets for the logged-in student
            const fetchTickets = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/Student');
                    const studentData = response.data.find(student => student.id === storedUser.id);
                    const studentTickets = studentData ? studentData.tickets : [];
                    setTickets(studentTickets.slice(0, 3)); // Show latest 3 tickets
                } catch (error) {
                    console.error('Error fetching tickets:', error);
                }
            };

            fetchTickets();
        } else {
            navigate('/'); // Redirect if not logged in
        }

        // Update current time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('studentUser');
        navigate('/');
    };

    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
                <button className={styles.toggleButton} onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <FaBars /> : <FaTimes />}
                </button>

                <div className={styles.sidebarContent}>
                    {!isCollapsed && student && (
                        <>
                            <h2>Welcome, {student.name}</h2>
                            <ul>
                                {/* <li>
                                    <Link className={styles.underLine} to="/profile">
                                        <FaUserCircle /> Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.underLine} to="/settings">
                                        <FaCog /> Settings
                                    </Link>
                                </li> */}
                                {/* <li>
                                    <Link className={styles.underLine} to="/create">
                                        <FaQuestionCircle /> Create Ticket
                                    </Link>
                                </li> */}
                                <li>
                                    <Link className={styles.underLine} to="/my-tickets">
                                        <FaTicketAlt /> My Tickets
                                    </Link>
                                </li>
                            </ul>
                            <Button variant="danger" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <h1>Student Dashboard</h1>

                {/* Welcome Banner */}
                <div className={styles.welcomeBanner}>
                    {/* <h2>Hello, {student?.name}!</h2> */}
                    <p>{currentTime.toLocaleDateString()}.</p>
                    <p>{currentTime.toLocaleTimeString()}</p>
                </div>

                {/* Profile Overview */}
                <div className={styles.profileOverview}>
                    <h3>Your Profile Overview</h3>
                    <p><strong>Student ID:</strong> {student?.id}</p>
                    <p><strong>Name:</strong> {student?.name}</p>
                    <p><strong>Role:</strong> Student</p>
                </div>

             
                {/* Announcements Section */}
                <div className={styles.announcements}>
                    <h3><FaBullhorn /> Announcements</h3>
                    <ul>
                        <li>New course materials are now available!</li>
                        <li>Exam schedule for this semester is out. Check the portal for details.</li>
                        <li>Maintenance on the student portal is scheduled for next Saturday.</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default Student;
