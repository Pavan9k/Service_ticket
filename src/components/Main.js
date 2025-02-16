
import { useNavigate } from 'react-router-dom'
import styles from '../components/main.module.css'
function Main() {

    const Navigate = useNavigate()

    const handleSubmit = (e) =>{
       // e.preventDefault();
       Navigate('/student')
       
    }
    return (
        <div className={styles.container}>

            <form className={styles.form}>

                <div>
                    <label htmlFor="uname"><b>User Id</b></label>
                    <input type="text" placeholder="Enter Username" name="uname" required />

                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required />
                </div>
                <div>
                    <button type="submit" onClick={(e)=> handleSubmit(e)}>Login</button>
                </div>

            </form>

        </div>
    )
}
export default Main