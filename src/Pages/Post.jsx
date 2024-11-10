import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import appwriteService from "../AppWrite/config";
import { Button, Container } from "../Component";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CirclesWithBar } from 'react-loader-spinner';
import Confirmation from "../Component/Confirmation";

export default function Post() {
    const [post, setPost] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.userData.$id : false;
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const successMessage = location.state?.successMessage || "";
    const [likedBy, setLikedBy] = useState([]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                progress: undefined,
                transition: Zoom,
            });
        }
    }, [successMessage]);

    useEffect(() => {
        if (slug) {
            const fetchPost = async () => {
                try {
                    const response = await appwriteService.getPosts();
                    const foundPost = response.documents.find((post) => post.slug === slug);
                    if (foundPost) {
                        setPost(foundPost);
                        setLikes(foundPost.likes || 0);
                        setComments(foundPost.comments || []);
                        setLikedBy(foundPost.likedBy || []);
                        setLiked(foundPost.likedBy.includes(userData?.userData.$id));
                    } else {
                        console.error("Post not found");
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                } finally {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                }
            };
            fetchPost();
        } else {
            navigate("/");
        }
    }, [slug, navigate, userData]);

    const handleLikeToggle = async () => {
        try {
            let updatedLikes = likes;
            let updatedLikedBy = [...likedBy];

            if (liked) {
                updatedLikes -= 1;
                updatedLikedBy = updatedLikedBy.filter(id => id !== userData?.userData.$id);
            } else {
                updatedLikes += 1;
                updatedLikedBy.push(userData?.userData.$id);
            }

            setLikes(updatedLikes);
            setLiked(!liked);
            setLikedBy(updatedLikedBy);

            await appwriteService.updatePostLikes(post.$id, updatedLikes, updatedLikedBy);
            toast.success(`You ${liked ? "unliked" : "liked"} this post.`, {
                position: "top-right",
                autoClose: 2000,
            });
        } catch (error) {
            toast.error("Failed to update like status. Please try again.");
            console.error("Error toggling like:", error);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") {
            toast.warn("Comment cannot be empty!");
            return;
        }

        const comment = {
            author: userData?.name || "Anonymous",
            content: newComment,
            createdAt: new Date().toLocaleString(),
        };

        try {
            const updatedComments = [...comments, comment];
            await appwriteService.updatePostComments(post.$id, updatedComments);

            setComments(updatedComments);
            setNewComment("");
            toast.success("Comment added successfully!");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                await appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete the post. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <CirclesWithBar
                    height="100"
                    width="100"
                    color="#3498db"
                    ariaLabel="circles-with-bar-loading"
                    visible={true}
                />
            </div>
        );
    }

    const filePreview = post?.featuredImage ? appwriteService.getFilePreview(post?.featuredImage) : "/default-image.jpg";

    return post ? (
        <div className="w-full bg-white py-8 px-4 shadow-lg">
            <ToastContainer />
            {showConfirm && (
                <Confirmation
                    message="Delete Post"
                    onConfirm={() => {
                        handleDelete();
                        setShowConfirm(false);
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            <Container>
                <div className="w-full text-center mb-4">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">{post?.title}</h1>
                    <p className="text-gray-600">Created by: {userData?.name} (You)</p>
                </div>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-4 bg-gray-100">
                    <img
                        src={filePreview}
                        alt={post?.title}
                        className="rounded-xl max-w-full max-h-96"
                    />
                    {isAuthor && (
                        <div className="absolute right-4 top-4 flex space-x-2">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-green-500">Edit</Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={() => setShowConfirm(true)}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="text-lg leading-relaxed text-gray-800 px-6">
                    {post?.content ? parse(post.content) : <p>No content available</p>}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <button
                        onClick={handleLikeToggle}
                        className={`p-2 rounded-full ${liked ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                    >
                        <i className="fas fa-thumbs-up"></i> {liked ? "Liked" : "Like"} ({likes})
                    </button>
                </div>
                <div className="mt-6 border-t pt-4 px-6">
                    <h2 className="text-xl font-semibold mb-4">Comments:</h2>
                    {comments.map((comment, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <p className="font-semibold text-gray-800">{comment.author}</p>
                                <span className="text-gray-500">{comment.createdAt}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                    <div className="mt-4">
                        <textarea
                            className="w-full p-2 border rounded-lg mb-2"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <Button bgColor="bg-blue-500 mt-2" onClick={handleAddComment}>Comment</Button>
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}
