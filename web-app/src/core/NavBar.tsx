import { Link, NavLink } from 'react-router';
import './NavBar.css';
import { useAuth } from '../features/auth/authStore';

export default function Navbar() {
    const { user, logout } = useAuth();

    return(
        <header className='app-header'>
            <span className='logo'>pixel</span>
            <nav className="nav">
                <NavLink to="/">Editor</NavLink>
                <NavLink to="/gallery">Gallery</NavLink>
            </nav>
            <div className='auth'>
                {user === null ?
                <>
                    <Link className='btn btn--primary' to="/login">Login</Link>
                    <Link className='btn' to="/register">Register</Link>
                </>
                :
                <>
                    <span>{user.email}</span>
                    <button className='btn' onClick={logout}>Logout</button>
                </>
                }
            </div>
        </header>
    )
}