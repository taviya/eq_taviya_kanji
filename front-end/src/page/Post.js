import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from "../component/common/Constant";

const Post = () => {
    const navigate = useNavigate();

    const [postData, setPostData] = useState({
        title: "",
        description: "",
    });

    const [validationError, setValidationError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = localStorage.getItem('token');
    const config = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'headers': { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        axios.post(`${API_BASE_URL}posts`, postData, config)
            .then(function (response) {
                setPostData({
                    title: "",
                    description: "",
                });

                Swal.fire({
                    icon: "success",
                    text: response.data.message
                });
                navigate("/login"); // Assuming you want to navigate somewhere after posting
                setIsSubmitting(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    setValidationError(error.response.data.errors);
                } else if (error.response) {
                    Swal.fire({
                        text: error.response.data.message,
                        icon: "error"
                    });
                } else {
                    // Handle other types of errors
                    console.error("Unexpected error:", error);
                }
                setIsSubmitting(false);
            });
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        <h1 className="text-center mb-3">Add Post</h1>
                        {
                            Object.keys(validationError).length > 0 && (
                                <div className="row">
                                    <div className="col-12">
                                        <div className="alert alert-danger">
                                            <ul className="mb-0">
                                                {
                                                    Object.entries(validationError).map(([key, value]) => (
                                                        <li key={key}>{value}</li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="Enter title"
                                    value={postData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    placeholder="Enter description"
                                    value={postData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
