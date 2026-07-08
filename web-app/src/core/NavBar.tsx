import { Link, NavLink } from 'react-router';
import './NavBar.css';

export default function Navbar()
{
    return(
        <header className='app-header'>
            <span className='logo'>pixel</span>
            <nav className="nav">
                <NavLink to="/">Editor</NavLink>
            </nav>
            <div className='auth'>
                <Link className='btn btn--primary' to="/login">Login</Link>
                <Link className='btn' to="/register">Register</Link>
            </div>
        </header>
    )
}