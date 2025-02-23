import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../nav/Nav';
import styles from './login.module.css';

function Login() {
    const [studentData, setStudentData] = useState([]);
    const [facultyData, setFacultyData] = useState([]);
    const [radioData, setRadioData] = useState('');
    const [loading, setLoading] = useState(true);
    const [loggingIn, setLoggingIn] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const idRef = useRef(null);
    const passRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentResponse, facultyResponse] = await Promise.all([
                    axios.get('http://localhost:8000/Student'),
                    axios.get('http://localhost:8000/Faculty'),
                ]);
                setStudentData(studentResponse.data || []);
                setFacultyData(facultyResponse.data || []);
            } catch (error) {
                setError('Error fetching data. Please try again.');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const enteredId = idRef.current?.value.trim();
        const enteredPassword = passRef.current?.value.trim();

        if (!enteredId || !enteredPassword || !radioData) {
            setError('All fields are required.');
            return;
        }

        setLoggingIn(true);
        setError('');
        localStorage.clear(); // Ensuring fresh login session

        let user = null;
        if (radioData === 'student') {
            user = studentData.find((i) => 
                String(i.id) === String(enteredId) && 
                String(i.pass) === String(enteredPassword)
            );
            if (user) {
                const authData = {
                    id: user.id,
                    name: user.name
                };
                localStorage.setItem('studentUser', JSON.stringify(authData));
            }
        } else if (radioData === 'faculty') {
            user = facultyData.find((i) => 
                String(i.id) === String(enteredId) && 
                String(i.pass) === String(enteredPassword)
            );
            if (user) {
                const authData = {
                    id: user.id,
                    name: user.name
                };
                localStorage.setItem('facultyUser', JSON.stringify(authData));
            }
        }

        if (user) {
            setTimeout(() => navigate(radioData === 'student' ? '/student' : '/faculty'), 1000);
        } else {
            setLoggingIn(false);
            setError('Invalid credentials. Please try again.');
            passRef.current.value = ''; // Clear password field on failed attempt
        }
    };

    return (
        <div className={styles.box}>
            <Nav />
            <div className={styles.container}>
                {loading ? (
                    <p className="text-center">Loading data...</p>
                ) : (
                    <Form className={styles.form} noValidate onSubmit={handleSubmit}>
                        <div>
                            <Form.Label><b>User Id</b></Form.Label>
                            <Form.Control
                                className={styles.input}
                                ref={idRef}
                                placeholder="Enter User ID"
                                required
                                type="text"
                                disabled={loggingIn}
                                autoComplete="off"
                            />
                            <Form.Label><b>Password</b></Form.Label>
                            <Form.Control
                                className={styles.input}
                                ref={passRef}
                                placeholder="Enter Password"
                                required
                                type="password"
                                disabled={loggingIn}
                                autoComplete="off"
                            />
                        </div>

                        <div className={styles.radio}>
                            <div className="d-flex align-items-center gap-2">
                                <Form.Check
                                    name="userType"
                                    type="radio"
                                    value="student"
                                    checked={radioData === 'student'}
                                    onChange={(e) => setRadioData(e.target.value)}
                                    disabled={loggingIn}
                                />
                                <Form.Label>Student</Form.Label>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <Form.Check
                                    name="userType"
                                    type="radio"
                                    value="faculty"
                                    checked={radioData === 'faculty'}
                                    onChange={(e) => setRadioData(e.target.value)}
                                    disabled={loggingIn}
                                />
                                <Form.Label>Faculty</Form.Label>
                            </div>
                        </div>

                        {/* Error Message Display */}
                        {error && <p className="text-danger mt-2 text-center">{error}</p>}

                        <div className="text-center">
                            <Button type="submit" variant="success" disabled={loggingIn}>
                                {loggingIn ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </Form>
                )}
            </div>
        </div>
    );
}

export default Login;
