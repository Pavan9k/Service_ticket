import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../nav/Nav';

function Login() {
    const [studentData, setStudentData] = useState([]);
    const [facultyData, setFacultyData] = useState([]);
    const [radioData, setRadioData] = useState('');
    const [validated, setValidated] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const idRef = useRef(null);
    const passRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentResponse = await axios.get('http://localhost:8000/Student');
                setStudentData(studentResponse.data);
                const facultyResponse = await axios.get('http://localhost:8000/Faculty');
                setFacultyData(facultyResponse.data);
            } catch (error) {
                setError('Error fetching data. Please try again.');
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (!form.checkValidity()) {
            event.stopPropagation();
        } else {
            setLoggingIn(true);
            setError('');

            const enteredId = idRef.current?.value;
            const enteredPassword = passRef.current?.value;

            let user = null;
            if (radioData === 'student') {
                user = studentData.find((i) => i.id === enteredId && i.pass === enteredPassword);
            } else if (radioData === 'faculty') {
                user = facultyData.find((i) => i.id === enteredId && i.pass === enteredPassword);
            }

            if (user) {
                localStorage.setItem('studentUser', JSON.stringify(user)); // Store user data
                setTimeout(() => {
                    navigate(radioData === 'student' ? '/student' : '/faculty');
                }, 1000);
            } else {
                setLoggingIn(false);
                setError('Invalid credentials. Please try again.');
            }
        }

        setValidated(true);
    };

    return (
        <div className={styles.box}>
            <Nav />
            <div className={styles.container}>
                <Form className={styles.form} noValidate validated={validated} onSubmit={handleSubmit}>
                    <div>
                        <Form.Label><b>User Id</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            ref={idRef}
                            placeholder="Enter User ID"
                            required
                            type="text"
                        />
                        <Form.Label><b>Password</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            ref={passRef}
                            placeholder="Enter Password"
                            required
                            type="password"
                        />
                    </div>

                    <div className={styles.radio}>
                        <div className='d-flex align-items-center gap-2'>
                            <Form.Check
                                name="userType"
                                required
                                type="radio"
                                value="student"
                                onChange={(e) => setRadioData(e.target.value)}
                            />
                            <Form.Label>Student</Form.Label>
                        </div>

                        <div className='d-flex align-items-center gap-2'>
                            <Form.Check
                                name="userType"
                                required
                                type="radio"
                                value="faculty"
                                onChange={(e) => setRadioData(e.target.value)}
                            />
                            <Form.Label>Faculty</Form.Label>
                        </div>
                    </div>

                    {/* Error Message Display */}
                    {error && <p className="text-danger">{error}</p>}

                    <div>
                        <Button type="submit" variant="success" disabled={loggingIn}>
                            {loggingIn ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Login;
