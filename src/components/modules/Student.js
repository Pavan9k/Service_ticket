import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './student.module.css';
import Button from 'react-bootstrap/Button';
import { FaBars, FaTimes } from 'react-icons/fa';

function Student() {
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const storedUser = JSON.parse(localStorage.getItem('studentUser'));


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('studentUser'));
        if (storedUser) {
            setStudentName(storedUser.name);
        } else {
            navigate('/'); // Redirect if not logged in
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('studentUser');
        navigate('/')
    };

    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
                <button className={styles.toggleButton} onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <FaBars /> : <FaTimes />}
                </button>

                <div className={styles.sidebarContent}>
                    {!isCollapsed && <h2>Welcome, {studentName}</h2>}

                    <ul>
                        {/* <li>Dashboard</li> */}
                        <li ><Link className={styles.underLine} to="/my-tickets">My Tickets</Link></li>
                    </ul>

                    {!isCollapsed && (
                        <Button variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <h1>Student Dashboard</h1>

                <p>Student Id : {storedUser.id}</p>
                <p>Student Name: {storedUser.name}</p>
            </main>
        </div>
    );
}

export default Student;
