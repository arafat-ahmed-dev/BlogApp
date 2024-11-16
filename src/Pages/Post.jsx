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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import profileService from "../AppWrite/Profile";
import user from '../assets/user.png'

export default function Post() {
    // State variables
    const [post, setPost] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [liked, setLiked] = useState(false);
    const [unliked, setUnliked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [authorProfile, setAuthorProfile] = useState(null);

    // Router and Redux hooks
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.auth.userData);

    // Derived state
    const isAuthor = post && userData ? post.userId === userData.userData.$id : false;
    const successMessage = location.state?.successMessage || "";
    const [likeCount, unlikeCount] = post.likes ? post.likes.split(",").map(Number) : [0, 0];
    const likedBy = post.likedBy ? JSON.parse(post.likedBy) : [];
    const unlikedBy = post.unlikedBy ? JSON.parse(post.unlikedBy) : [];

    // Success message effect
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

    // Fetch post data effect
    useEffect(() => {
        if (slug) {
            const fetchPost = async () => {
                try {
                    const response = await appwriteService.getPosts();
                    const foundPost = response.documents.find((post) => post.slug === slug);
                    if (foundPost) {
                        setPost(foundPost);
                        setComments(JSON.parse(foundPost.comments || '[]'));
                        
                        // Fetch author profile
                        const authorResponse = await profileService.getProfile(foundPost.userId);
                        if (authorResponse.documents.length > 0) {
                            setAuthorProfile(authorResponse.documents[0]);
                        }
                    } else {
                        console.error("Post not found");
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                    toast.error("Failed to load post. Please try again.");
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

    useEffect(() => {
        if (userData?.userData) {
            setLiked(likedBy.includes(userData.userData.$id));
            setUnliked(unlikedBy.includes(userData.userData.$id));
        }
    }, [likedBy, unlikedBy, userData]);

    // Like handling
    const handleLikeToggle = async () => {
        if (!userData?.userData) {
            toast.error("Please login to like the post");
            return;
        }

        if (liked) {
            // Remove like
            const updatedLikeCount = likeCount - 1;
            const updatedLikedBy = likedBy.filter(id => id !== userData.userData.$id);

            await appwriteService.updatePostLikes(
                post.$id,
                updatedLikeCount,
                unlikeCount,
                JSON.stringify(updatedLikedBy),
                JSON.stringify(unlikedBy)
            );
            setPost((prev) => ({
                ...prev,
                likes: `${updatedLikeCount},${unlikeCount}`,
                likedBy: JSON.stringify(updatedLikedBy)
            }));
            setLiked(false);
        } else if (!unliked) {
            // Add like
            const updatedLikeCount = likeCount + 1;
            const updatedLikedBy = [...likedBy, userData.userData.$id];

            await appwriteService.updatePostLikes(
                post.$id,
                updatedLikeCount,
                unlikeCount,
                JSON.stringify(updatedLikedBy),
                JSON.stringify(unlikedBy)
            );
            setPost((prev) => ({
                ...prev,
                likes: `${updatedLikeCount},${unlikeCount}`,
                likedBy: JSON.stringify(updatedLikedBy)
            }));
            setLiked(true);
        } else {
            toast.warn("You have already unliked this post");
        }
    };

    const handleUnlikeToggle = async () => {
        if (!userData?.userData) {
            toast.error("Please login to unlike the post");
            return;
        }

        if (unliked) {
            // Remove unlike
            const updatedUnlikeCount = unlikeCount - 1;
            const updatedUnlikedBy = unlikedBy.filter(id => id !== userData.userData.$id);

            await appwriteService.updatePostLikes(
                post.$id,
                likeCount,
                updatedUnlikeCount,
                JSON.stringify(likedBy),
                JSON.stringify(updatedUnlikedBy)
            );
            setPost((prev) => ({
                ...prev,
                likes: `${likeCount},${updatedUnlikeCount}`,
                unlikedBy: JSON.stringify(updatedUnlikedBy)
            }));
            setUnliked(false);
        } else if (!liked) {
            // Add unlike
            const updatedUnlikeCount = unlikeCount + 1;
            const updatedUnlikedBy = [...unlikedBy, userData.userData.$id];

            await appwriteService.updatePostLikes(
                post.$id,
                likeCount,
                updatedUnlikeCount,
                JSON.stringify(likedBy),
                JSON.stringify(updatedUnlikedBy)
            );
            setPost((prev) => ({
                ...prev,
                likes: `${likeCount},${updatedUnlikeCount}`,
                unlikedBy: JSON.stringify(updatedUnlikedBy)
            }));
            setUnliked(true);
        } else {
            toast.warn("You have already liked this post");
        }
    };

    // Comment handling
    const handleAddComment = async () => {
        if (!userData?.userData) {
            toast.error("Please login to comment");
            return;
        }

        if (newComment.trim() === "") {
            toast.warn("Comment cannot be empty!");
            return;
        }

        const comment = {
            author: userData.userData.name || "Anonymous",
            content: newComment,
            profilePicture: userData.userData.$id,
            createdAt: new Date().toLocaleString(),
        };

        try {
            const updatedComments = [...comments, comment];
            await appwriteService.updatePostComments(post.$id, JSON.stringify(updatedComments));

            setComments(updatedComments);
            setNewComment("");
            toast.success("Comment added successfully!");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment. Please try again.");
        }
    };

    // Post deletion
    const handleDelete = async () => {
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                await appwriteService.deleteFile(post.featuredImage);
                navigate("/", { state: { successMessage: "Post deleted successfully!" } });
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete the post. Please try again.");
        }
    };
    // Loading state
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

    const filePreview = post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : user;

    return post ? (
        <div className="w-full bg-white py-8 px-4 shadow-lg">
            <ToastContainer />
            {/* Confirmation Dialog */}
            {showConfirm && (
                <Confirmation
                    message="Are you sure you want to delete this post?"
                    onConfirm={() => {
                        handleDelete();
                        setShowConfirm(false);
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            <Container>
                {/* Post Header */}
                <div className="w-full text-center mb-4">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">{post?.title}</h1>
                    <p className="text-gray-600">Created by: {" "}
                        <Link to={`/profile/${post?.userId}`} className="text-blue-500 hover:text-blue-700">
                            {authorProfile?.profileName || "Unknown Author"}
                        </Link>
                    </p>
                </div>

                {/* Featured Image and Author Actions */}
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

                {/* Post Content */}
                <div className="text-lg leading-relaxed text-gray-800 px-6">
                    {post?.content ? parse(post.content) : <p>No content available</p>}
                </div>

                {/* Like Section */}
                <div className="flex items-center justify-start space-x-4 mt-4 p-4 rounded-lg shadow-sm">
                    <button
                        onClick={handleLikeToggle}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 border-2 ${liked ? "bg-blue-500 text-white border-blue-500" : "text-black border-black"}`}
                    >
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className="text-xl"
                        />
                        <span className="font-medium">{likeCount} Like</span>
                    </button>
                    <button
                        onClick={handleUnlikeToggle}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 border-2 ${unliked ? "bg-red-500 text-white border-red-500" : "text-red-500 border-red-500"}`}
                    >
                        <FontAwesomeIcon
                            icon={faThumbsDown}
                            className="text-xl"
                        />
                        <span className="font-medium">{unlikeCount} Unlike</span>
                    </button>
                </div>

                {/* Comments Section */}
                <div className="mt-6 border-t pt-4 px-6">
                    <h2 className="text-xl font-semibold mb-4">Comments:</h2>
                    {comments.map((comment, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <img src={appwriteService.getFilePreview(comment.profilePicture) || user} alt={authorProfile?.profileName} className="w-10 h-10 rounded-full object-cover shadow-lg" />
                                <Link to={`/profile/${authorProfile?.userId}`} className="font-semibold text-gray-800">{comment.author}</Link>
                                <span className="text-gray-500">{comment.createdAt}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                    <div className="mt-4">
                        <textarea
                            className="w-full p-2 border rounded-lg mb-2"
                            rows="4"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <button
                            onClick={handleAddComment}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Add Comment
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    ) : (
        <div>Post not found.</div>
    );
}
