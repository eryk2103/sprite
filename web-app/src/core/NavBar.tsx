import { Link, NavLink } from 'react-router';
import styles from './NavBar.module.css';
import { useAuth } from '../features/auth/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return(
        <header className={styles['app-header']}>
            <span className='logo'>pixel</span>
            <nav className={styles.nav}>
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `${styles['nav__link']}${isActive ? ` ${styles['nav__link--active']}` : ''}`}
                >
                    Editor
                </NavLink>
                <NavLink
                    to="/gallery"
                    className={({ isActive }) => `${styles['nav__link']}${isActive ? ` ${styles['nav__link--active']}` : ''}`}
                >
                    Gallery
                </NavLink>
            </nav>
            <div className={styles.auth}>
                {user === null ?
                <>
                    <Link className='btn btn--primary' to="/login">Login</Link>
                    <Link className='btn btn--secondary' to="/register">Register</Link>
                </>
                :
                <>
                    <span>{user.email}</span>
                    <button className='btn btn--secondary' onClick={logout}>Logout</button>
                </>
                }
            </div>
        </header>
    )
}
