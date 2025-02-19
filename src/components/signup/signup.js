import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import styles from './signup.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../nav/Nav';

function Signup() {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        if (pass !== confirmPassword) {
            setError('Passwords do not match.');
            setSuccess('');
            return;
        }

        if (!role) {
            setError('Please select a role.');
            setSuccess('');
            return;
        }

        try {
            const apiEndpoint = role === "student" ? "http://localhost:8000/Student" : "http://localhost:8000/Faculty";

            // Check if user already exists
            const existingUsers = await axios.get(apiEndpoint);
            if (existingUsers.data.some(user => user.id === id)) {
                setError('User ID already exists. Please choose another.');
                setSuccess('');
                return;
            }

            // Save new user
            const newUser = { name, id, pass };
            await axios.post(apiEndpoint, newUser);
            
            setSuccess('Signup successful! Redirecting...');
            setError('');

            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setError('Error signing up. Please try again.');
            setSuccess('');
            console.error('Signup error:', error);
        }
    };

    return (
        <div className={styles.box}>
            <Nav />
            <div className={styles.container}>
                <Form 
                    className={`${styles.form} ${validated ? 'was-validated' : ''}`} 
                    noValidate 
                    validated={validated} 
                    onSubmit={handleSubmit}
                >
                    <Form.Group controlId="formName">
                        <Form.Label><b>Name</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            type="text"
                            placeholder="Enter Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formId">
                        <Form.Label><b>User ID</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            type="text"
                            placeholder="Enter User ID"
                            required
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPass">
                        <Form.Label><b>Password</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            type="password"
                            placeholder="Enter Password"
                            required
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label><b>Confirm Password</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            type="password"
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    {/* Role Selection */}
                    <div className={styles.radio}>
                        <Form.Check
                            name="userType"
                            type="radio"
                            value="student"
                            label="Student"
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                        <Form.Check
                            name="userType"
                            type="radio"
                            value="faculty"
                            label="Faculty"
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                    </div>

                    {/* Display Errors or Success Messages */}
                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <Button type="submit" variant="success">Sign Up</Button>
                </Form>
            </div>
        </div>
    );
}

export default Signup;
