import { Link } from "react-router-dom";
import styles from './nav.module.css'

function Nav(){
    return(
        <div className={styles.nav}>
            <Link to='/student'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
        </div>
    )
}

export default Nav