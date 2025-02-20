import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './student.module.css';
import Button from 'react-bootstrap/Button';
import { FaBars, FaTimes } from 'react-icons/fa';

function Student() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('studentUser'));
        if (storedUser) {
            setStudent(storedUser);
        } else {
            navigate('/'); // Redirect if not logged in
        }
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
                                <li>
                                    <Link className={styles.underLine} to="/my-tickets">
                                        My Tickets
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
                {student && (
                    <>
                        <p>Student Id : {student.id}</p>
                        <p>Student Name: {student.name}</p>
                    </>
                )}
            </main>
        </div>
    );
}

export default Student;
