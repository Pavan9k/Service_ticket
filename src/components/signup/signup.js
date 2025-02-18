import { useNavigate } from 'react-router-dom';
import styles from './signup.module.css';
import { useState } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../nav/Nav';

function Signup() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (!form.checkValidity() || password !== confirmPassword) {
            event.stopPropagation();
            setError('Passwords do not match.');
            return;
        }

        setValidated(true);

        try {
            const endpoint = role === 'student' ? 'http://localhost:8000/Student' : 'http://localhost:8000/Faculty';
            await axios.post(endpoint, { id: userId, pass: password });

            setSuccess('Signup successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setError('Signup failed. Please try again.');
        }
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
                            placeholder="Enter User ID"
                            required
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <Form.Label><b>Password</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            placeholder="Enter Password"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Form.Label><b>Confirm Password</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            placeholder="Confirm Password"
                            required
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.radio}>
                        <div className='d-flex align-items-center gap-2'>
                            <Form.Check
                                name="userType"
                                required
                                type="radio"
                                value="student"
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <Form.Label>Student</Form.Label>
                        </div>

                        <div className='d-flex align-items-center gap-2'>
                            <Form.Check
                                name="userType"
                                required
                                type="radio"
                                value="faculty"
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <Form.Label>Faculty</Form.Label>
                        </div>
                    </div>

                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <div>
                        <Button type="submit" variant="success">Sign Up</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Signup;
