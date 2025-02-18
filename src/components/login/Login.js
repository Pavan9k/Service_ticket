
import { useNavigate } from 'react-router-dom'
import styles from './login.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../nav/Nav';


function Login() {
    // const [loginData,setLoginData] = useState()
    const [studentData, setStudetData] = useState([]);
    const [facultyData, setFacultyData] = useState([]);
    const [radioData, setRadioData] = useState('')
    const [borderData, setBorderData] = useState({ borderId: '', borderPass: '' })
    const [flag, setFlag] = useState(false)
    const [validated, setValidated] = useState(false);


    const Navigate = useNavigate()



    useEffect(() => {
        const fetchData = async () => {
            const studentResponse = await axios.get('http://localhost:8000/Student')
            setStudetData(studentResponse.data)
            const facultyResponse = await axios.get('http://localhost:8000/Faculty')
            setFacultyData(facultyResponse.data)
        }
        fetchData()
    }, [])


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        event.preventDefault();
        if (flag === true) {
            Navigate('/student')
        }
    };




    const handleId = (e) => {
        const stuValue = e.target.value


    }

    const handlePass = (e) => {
        const value = e.target.value

    }
    const handleFacultyInput = (e) => {
        console.log(e.target.value)
    }
    const handleRadioBtn = (e) => {
        setRadioData(e.target.value)
    }


    return (
        <div className={styles.box}>

            <div>
                <Nav />
            </div>
            <div className={styles.container}>

                <Form className={styles.form} noValidate validated={validated} onSubmit={handleSubmit}>
                    <div>
                        <Form.Label><b>User Id</b></Form.Label>
                        <Form.Control className={styles.input} placeholder="Enter UserId"
                            required
                            type="text"
                        />
                        <Form.Label><b>Password</b></Form.Label>
                        <Form.Control className={styles.input} placeholder="Enter UserId"
                            required
                            type="password"
                        />
                    </div>

                    <div className={styles.radio}>
                        <div className='d-flex align-items-center gap-2'>
                            <Form.Check name='check'
                                required
                                type="radio" value='student'
                            />
                            <Form.Label>student</Form.Label>

                        </div>

                        <div className='d-flex align-items-center gap-2'>

                            <Form.Check name='check'
                                required
                                type="radio" value='faculty'
                            />
                            <Form.Label>faculty</Form.Label>
                        </div>
                    </div>
                    <div>
                        <Button type="submit" variant="warning" onClick={(e) => handleSubmit(e)}>Login</Button>
                    </div>
                </Form>
            </div>
        </div>

    )
}
export default Login




