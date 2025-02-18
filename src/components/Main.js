
import { useNavigate } from 'react-router-dom'
import styles from '../components/main.module.css'
import { use, useEffect, useState } from 'react'
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Nav from './Nav';


function Main() {
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
        if (stuValue.length > 0) {
            if (stuValue.length < 6) {

                setBorderData({ ...borderData, borderId: 'red' })
            }
            else {

                setBorderData({ ...borderData, borderId: 'green' })
            }
        }
        else {
            setBorderData({ ...borderData, borderId: '' })
        }

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
        <div className={styles.container}>
            <div>
                <Nav />
            </div>

            <div>
                
            </div>

            <Form className={styles.form} noValidate validated={validated} onSubmit={handleSubmit}>
                <div>


                    <label><b>User Id</b></label>
                    <Form.Control className={styles.input} placeholder="Enter UserId"
                        required
                        type="text"
                    />
                    <label><b>Password</b></label>
                    <Form.Control className={styles.input} placeholder="Enter UserId"
                        required
                        type="password"
                    />
                </div>

                <div>
                    <span>
                        <input name='check' value='student' type='radio' onChange={handleRadioBtn} />
                        <label>student</label>
                    </span>

                    <span>
                        <input name='check' value='faculty' type='radio' onChange={handleRadioBtn} />
                        <label>faculty</label>
                    </span>

                </div>
                <div>
                    <Button type="submit" onClick={(e) => handleSubmit(e)}>Login</Button>
                </div>

            </Form>



        </div>
    )
}
export default Main




