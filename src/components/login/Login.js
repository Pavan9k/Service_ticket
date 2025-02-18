
import { useNavigate } from 'react-router-dom'
import styles from './login.module.css'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../nav/Nav';


function Login() {
    // const [loginData,setLoginData] = useState()
    const [studentData, setStudentData] = useState([]);
    const [facultyData, setPassData] = useState([]);
    const [radioData, setRadioData] = useState('')
    const [borderData, setBorderData] = useState({ borderId: '', borderPass: '' })
    const [flag, setFlag] = useState({ flagId: false, flagPass: false })
    const [validated, setValidated] = useState(false);
  


    const Navigate = useNavigate()

    const idRef = useRef(null)
    const passRef = useRef(null)



    useEffect(() => {
        const fetchData = async () => {
            const studentResponse = await axios.get('http://localhost:8000/Student')
            setStudentData(studentResponse.data)
            const passResponse = await axios.get('http://localhost:8000/Faculty')
            setPassData(passResponse.data)
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
        // if (flag === true) {
        //     Navigate('/student')
        // }
    };

    const handleId = () => {
        const value = idRef.current.value
        handleFlag()
    }


    const handlePass = () => {
        const value = passRef.current.value
        // const IdList = studentData.map((i) => i.id)
        // const passList = facultyData.map((i) => i.pass)
    }
    const handleFlag = () => {

        const enteredId = idRef.current.value
        const enteredPassword = passRef.current.value


        if(radioData === 'student'){
           const userData = studentData.filter((i) => i.id === enteredId)
           console.log(userData)



        }
        else if(radioData==='faculty') {
            const userData = facultyData.filter((i) => i.id === enteredId)
            console.log(userData)
        }


       // const enteredPassword = passRef.current.value

     


      
    }

    const handleRadioBtn = (e) => {
        setRadioData(e.target.value)
    }

    ///console.log(radioData, flag)


    return (
        <div className={styles.box}>

            <div>
                <Nav />
            </div>

            <div className={styles.container}>

                <Form className={styles.form} noValidate validated={validated} onSubmit={handleSubmit}>
                    <div>
                        <Form.Label><b>User Id</b></Form.Label>
                        <Form.Control className={styles.input} ref={idRef} placeholder="Enter UserId"
                            required
                            type="text" onInput={handleId}
                        />
                        <Form.Label><b>Password</b></Form.Label>
                        <Form.Control className={styles.input} ref={passRef} placeholder="Enter UserId"
                            required
                            type="password" onChange={handlePass}
                        />
                    </div>

                    <div className={styles.radio}>
                        <div className='d-flex align-items-center gap-2'>
                            <Form.Check name='check' 
                                required
                                type="radio" value='student' onChange={handleRadioBtn}
                            />
                            <Form.Label>student</Form.Label>

                        </div>

                        <div className='d-flex align-items-center gap-2'>

                            <Form.Check name='check' 
                                required 
                                type="radio" value='faculty' onChange={handleRadioBtn}
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




