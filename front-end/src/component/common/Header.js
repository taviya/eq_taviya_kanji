import React from "react";
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const config = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'headers': { Authorization: `Bearer ${token}` }
    };

    const logout = async () => {
        try {
            await axios.post(`http://localhost:8000/api/logout`, null, config);
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('user_id');
            Swal.fire({
                icon: "success",
                text: "Logged out successfully!"
            });
            navigate("/");
        } catch (error) {
            if (error.response.status === 422) {
                alert(error.response.data.errors);
            } else {
                Swal.fire({
                    text: error.response.data.message,
                    icon: "error"
                });
            }
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">
                <strong>Blog Post</strong>
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarText"
                aria-controls="navbarText"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                            Home
                        </Link>
                    </li>
                    {
                        localStorage.getItem('token') ? (
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/post' ? 'active' : ''}`} to="/post">
                                    Post
                                </Link>
                            </li>
                        ) : ''
                    }
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        {
                            localStorage.getItem('token') ? (
                                <button className="btn btn-link nav-link" onClick={logout}>
                                    {localStorage.getItem('name')} - Logout
                                </button>
                            ) : (
                                <Link className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} to="/login">
                                    Login
                                </Link>
                            )
                        }
                    </li>
                    <li className="nav-item">
                        {
                            localStorage.getItem('token') ? (
                                ''
                            ) : (
                                <Link className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`} to="/register">
                                    Register
                                </Link>
                            )
                        }
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;
