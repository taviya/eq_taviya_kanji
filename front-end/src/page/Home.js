import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../component/common/Constant";
import Swal from 'sweetalert2';

const Home = () => {
    const [posts, setPosts] = useState({});
    const [commentData, setCommentData] = useState({});
    const [dataMessage, setDataMessage] = useState('Please Wait...');

    const token = localStorage.getItem('token');
    const config = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'headers': { Authorization: `Bearer ${token}` }
    };

    const formatCreatedAtDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const fetchPosts = async () => {
        setDataMessage('Please Wait...');
        try {
            const response = await axios.get(`${API_BASE_URL}get_post`);
            setPosts(response.data.data.reduce((acc, post) => {
                acc[post.id] = post;
                return acc;
            }, {}));
        } catch (error) {
            console.error("Error fetching posts", error);
        }
        setDataMessage('No posts available.');
    };

    useEffect(() => {
        fetchPosts();

        // Poll the server for updates every 10 seconds
        const intervalId = setInterval(() => {
            fetchPosts();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleCommentChange = (e, postId) => {
        setCommentData({
            ...commentData,
            [postId]: {
                ...commentData[postId],
                content: e.target.value,
            },
        });
    };

    const handleReplyChange = (e, postId, parentCommentId) => {
        setCommentData({
            ...commentData,
            [postId]: {
                ...commentData[postId],
                [parentCommentId]: {
                    ...commentData[postId]?.[parentCommentId],
                    content: e.target.value,
                },
            },
        });
    };

    const handleCommentSubmit = async (postId) => {
        // Check if the comment content is empty
        if (!commentData[postId]?.content) {
            Swal.fire({
                icon: "error",
                text: "Comment content cannot be empty."
            });
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}add_comment/${postId}`,
                { content: commentData[postId]?.content },
                config
            ).then(function (response) {
                setCommentData({
                    ...commentData,
                    [postId]: {
                        content: "",
                    },
                });

                Swal.fire({
                    icon: "success",
                    text: response.data.message
                });
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    // setValidationError(error.response.data.errors);
                } else if (error.response) {
                    Swal.fire({
                        text: error.response.data.message,
                        icon: "error"
                    });
                }
            });;

            // Fetch posts after submitting a comment
            fetchPosts();
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const handleReplySubmit = async (postId, parentCommentId) => {
        if (!commentData[postId]?.[parentCommentId]?.content) {
            Swal.fire({
                icon: "error",
                text: "Reply content cannot be empty."
            });
            return;
        }
         
        try {
            const response = await axios.post(
                `${API_BASE_URL}add_comment/${postId}/${parentCommentId}`,
                { content: commentData[postId]?.[parentCommentId]?.content },
                config
            );

            setCommentData({
                ...commentData,
                [postId]: {
                    ...commentData[postId],
                    [parentCommentId]: {
                        content: "",
                    },
                },
            });

            // Fetch posts after submitting a reply
            fetchPosts();
        } catch (error) {
            console.error("Error adding reply", error);
        }
    };

    const handleReplyButtonClick = (postId, parentCommentId) => {
        const loggedInUserId = localStorage.getItem('user_id');
        const postCreatorId = posts[postId]?.user.id;

        // Check if the logged-in user is the post creator
        if (loggedInUserId == postCreatorId) {
            setCommentData({
                ...commentData,
                [postId]: {
                    ...commentData[postId],
                    [parentCommentId]: {
                        content: "",
                    },
                },
            });
        } else {
            alert("You can only reply to comments on your own posts.");
        }
    };

    // Recursive function to render nested comments
    const renderComments = (comments, postId) => {
        const loggedInUserId = localStorage.getItem('user_id');
        const postCreatorId = posts[postId]?.user.id;
        
        return (
            <ul className="list-group mt-3">
                {comments.map((comment) => (
                    <li key={comment.id} className="list-group-item">
                        <div>
                            <div>
                                <p className="mb-0">
                                    <span>{comment.content}</span>
                                    <strong className="ml-2"> - By {comment.user.name}</strong>
                                </p>
                            </div>

                            {postCreatorId == loggedInUserId && (
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={() => handleReplyButtonClick(postId, comment.id)}
                                >
                                    Reply
                                </button>
                            )}
                        </div>

                        <div>
                            {comment.replies.map((reply) => (
                                <li key={reply.id} className="list-group-item">
                                    <div>
                                        {reply.content}
                                    </div>
                                </li>
                            ))}
                        </div>
    
                        {/* Nested comment form */}
                        {commentData[postId]?.[comment.id] && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleReplySubmit(postId, comment.id);
                                }}
                            >
                                <div className="mb-2">
                                    <textarea
                                        name="content"
                                        className="form-control"
                                        placeholder={`Reply to ${comment.user.name}...`}
                                        value={commentData[postId]?.[comment.id]?.content || ""}
                                        onChange={(e) => handleReplyChange(e, postId, comment.id)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Add Reply
                                </button>
                            </form>
                        )}
    
                        {/* Recursively render nested comments */}
                        {/* {comment.nestedComments && comment.nestedComments.length > 0 && renderComments(comment.nestedComments, postId, commentatorName || comment.name)} */}
                    </li>
                ))}
            </ul>
        );
    };   

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-3">Post</h1>
            {Object.values(posts).length === 0 ? (
                <p className="alert alert-info">{dataMessage}</p>
            ) : (
                <ul className="list-group">
                    {Object.values(posts).map((post) => (
                        <li key={post.id} className="list-group-item">
                            <h3>{post.title}</h3>
                            {/* <p className="text-muted bg-light p-2">Created by: {post.user.name}</p> */}
                            <p>{post.description}</p>
                            <div className="d-flex justify-content-between mb-4">
                                <button type="button" className="btn btn-info btn-sm">Added On - {formatCreatedAtDate(post.created_at)}</button>
                                <button type="button" className="btn btn-info btn-sm">Added by - {post.user.name}</button>
                            </div>

                            {/* Comment form */}
                            {/* Comment form */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleCommentSubmit(post.id);
                                }}
                            >
                                <div className="form-group">
                                    <textarea
                                        name="content"
                                        className="form-control"
                                        placeholder="Add a comment..."
                                        value={commentData[post.id]?.content || ""}
                                        onChange={(e) => handleCommentChange(e, post.id)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Add Comment
                                </button>
                            </form>


                            {/* Display comments */}
                            {post.comments && post.comments.length > 0 && (
                                <div className="mt-3">
                                    {renderComments(post.comments, post.id)}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;
