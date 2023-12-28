import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../component/common/Constant";

const Login = () => {
    const navigate = useNavigate();
    let token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitForm = async () => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await axios.post(`${API_BASE_URL}login`, formData);

            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('user_id', response.data.id);
            Swal.fire({
                icon: "success",
                text: response.data.message
            });
            navigate("/");
            setIsSubmitting(false);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: error.response ? error.response.data.message : "An error occurred",
                    icon: "error"
                });
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-sm-8 col-md-6">
                    <div className="card p-4">
                        <h1 className="text-center mb-3">Login</h1>

                        {Object.keys(validationError).length > 0 && (
                            <div className="alert alert-danger">
                                <ul className="mb-0">
                                    {Object.entries(validationError).map(([key, value]) => (
                                        <li key={key}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email address:</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                onChange={e => setEmail(e.target.value)}
                                id="email"
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                onChange={e => setPassword(e.target.value)}
                                id="pwd"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={submitForm}
                            className="btn btn-primary w-100"
                            disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
