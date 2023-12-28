import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../component/common/Constant";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    let token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, []);

    const submitForm = async () => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirm_password', confirmPassword);

            const response = await axios.post(`${API_BASE_URL}register`, formData);

            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('user_id', response.data.id);
            Swal.fire({
                icon: "success",
                text: response.data.message
            });
            navigate("/login");
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
                <div className="col-md-6">
                    <div className="card p-4">
                        <h1 className="text-center mb-3">Register</h1>

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
                            <label>Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter name"
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Email address:</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Confirm Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                id="confirmPassword"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={submitForm}
                            className="btn btn-primary mx-2 mt-4 w-100"
                            disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
