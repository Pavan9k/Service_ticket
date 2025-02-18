import { Link } from "react-router-dom";
import styles from './nav.module.css'

function Nav(){
    return(
        <div className={styles.navBar}>
           
            <div className={styles.logo}>
                LOGO
            </div>

            <div className={styles.navLinks}>
            <Link to='/'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
            </div>
           
        </div>
    )
}

export default Nav