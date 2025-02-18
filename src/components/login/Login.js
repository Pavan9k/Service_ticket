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
    const [flag, setFlag] = useState({ flagStudent: false, flagFaculty: false });
    const [validated, setValidated] = useState(false);

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
            if (flag.flagStudent) {
                navigate('/student');
            } else if (flag.flagFaculty) {
                navigate('/faculty');
            } else {
                alert('Invalid credentials');
            }
        }
        setValidated(true);
    };

    const handleFlag = (selectedRole) => {
        const enteredId = idRef.current?.value;
        const enteredPassword = passRef.current?.value;

        if (!enteredId || !enteredPassword) return;

        if (selectedRole === 'student') {
            const userData = studentData.find((i) => i.id === enteredId);
            setFlag({ flagStudent: userData?.pass === enteredPassword, flagFaculty: false });
        } else if (selectedRole === 'faculty') {
            const userData = facultyData.find((i) => i.id === enteredId);
            setFlag({ flagStudent: false, flagFaculty: userData?.pass === enteredPassword });
        }
    };

    const handleRadioBtn = (e) => {
        const selectedRole = e.target.value;
        setRadioData(selectedRole);
        handleFlag(selectedRole);
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
                            onChange={() => handleFlag(radioData)}
                        />
                        <Form.Label><b>Password</b></Form.Label>
                        <Form.Control
                            className={styles.input}
                            ref={passRef}
                            placeholder="Enter Password"
                            required
                            type="password"
                            onChange={() => handleFlag(radioData)}
                        />
                    </div>

                    <div className={styles.radio}>
                        <div className='d-flex align-items-center gap-2'>
                            <Form.Check
                                name="userType"
                                required
                                type="radio"
                                value="student"
                                onChange={handleRadioBtn}
                            />
                            <Form.Label>Student</Form.Label>
                        </div>

                        <div className='d-flex align-items-center gap-2'>
                            <Form.Check
                                name="userType"
                                required
                                type="radio"
                                value="faculty"
                                onChange={handleRadioBtn}
                            />
                            <Form.Label>Faculty</Form.Label>
                        </div>
                    </div>

                    <div>
                        <Button type="submit" variant="warning">Login</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Login;
