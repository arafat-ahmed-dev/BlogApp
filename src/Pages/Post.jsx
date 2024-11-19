// Import necessary dependencies
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import appwriteService from "../AppWrite/config";
import { Button, Container } from "../Component";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confirmation from "../Component/Confirmation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import profileService from "../AppWrite/Profile";
import user from '../assets/user.png';


export default function Post() {
    // State management for post data and UI controls
    const [post, setPost] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [liked, setLiked] = useState(false);
    const [unliked, setUnliked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [authorProfile, setAuthorProfile] = useState(null);
    const [showAllComments, setShowAllComments] = useState(false);

    // Router and Redux hooks
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.auth.userData);

    // Derived state calculations
    const isAuthor = post && userData ? post.userId === userData.userData.$id : false;
    const successMessage = location.state?.successMessage || "";
    const [likeCount, unlikeCount] = post.likes ? post.likes.split(",").map(Number) : [0, 0];
    const likedBy = post.likedBy ? JSON.parse(post.likedBy) : [];
    const unlikedBy = post.unlikedBy ? JSON.parse(post.unlikedBy) : [];

    // Handle success message display
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, {
                position: "top-right",
                autoClose: 2000,
                theme: "dark",
                transition: Zoom,
            });
            // Clear success message from location state
            window.history.replaceState({}, document.title);
        }
    }, [successMessage]);

    // Fetch post data and author profile
    useEffect(() => {
        if (slug) {
            const fetchPost = async () => {
                try {
                    const response = await appwriteService.getPosts();
                    const foundPost = response.documents.find((post) => post.slug === slug);
                    if (foundPost) {
                        setPost(foundPost);
                        setComments(JSON.parse(foundPost.comments || '[]'));

                        const authorResponse = await profileService.getProfile(foundPost.userId);
                        if (authorResponse.documents.length > 0) {
                            setAuthorProfile(authorResponse.documents[0]);
                        }
                    } else {
                        navigate("/");
                    }
                } catch (error) {
                    toast.error("Failed to load post. Please try again.");
                } finally {
                    setTimeout(() => setLoading(false), 1000);
                }
            };
            fetchPost();
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    // Update like/unlike status based on user data
    useEffect(() => {
        if (userData?.userData) {
            setLiked(likedBy.includes(userData.userData.$id));
            setUnliked(unlikedBy.includes(userData.userData.$id));
        }
    }, [likedBy, unlikedBy, userData]);

    // Handle like functionality
    const handleLikeToggle = async () => {
        if (!userData?.userData) {
            toast.error("Please login to like the post");
            return;
        }

        if (isAuthor) {
            toast.error("You cannot like your own post");
            return;
        }

        if (liked) {
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

    // Handle unlike functionality
    const handleUnlikeToggle = async () => {
        if (!userData?.userData) {
            toast.error("Please login to unlike the post");
            return;
        }

        if (isAuthor) {
            toast.error("You cannot unlike your own post");
            return;
        }

        if (unliked) {
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

    // Handle comment addition
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
            toast.error("Failed to add comment. Please try again.");
        }
    };

    // Handle post deletion
    const handleDelete = async () => {
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                await appwriteService.deleteFile(post.featuredImage);
                navigate("/", { state: { successMessage: "Post deleted successfully!" } });
            }
        } catch (error) {
            toast.error("Failed to delete the post. Please try again.");
        }
    };

    // Loading state UI
    const ShimmerPost = () => (
        <div className="w-full bg-gray-700 py-8 px-4 shadow-lg animate-pulse">
            <Container>
                <div className="w-full text-center mb-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="w-full flex justify-center mb-4 relative">
                    <div className="h-96 bg-gray-200 rounded-xl w-full"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                    <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                </div>
                <div className="mt-6 border-t pt-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-2">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );

    if (loading) {
        return <ShimmerPost />;
    }

    // Get file preview URL
    const filePreview = post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : user;

    // Main post UI render
    return post ? (
        <div className="w-full bg-white py-8 px-4 shadow-lg">
            <ToastContainer />
            {showConfirm && (
                <Confirmation
                    message="delete post"
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
                    {/* Author Actions - Mobile */}
                    {isAuthor && (
                        <div className="md:hidden flex justify-center space-x-2 mt-4">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-green-500" className="text-xs">Edit</Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={() => setShowConfirm(true)} className="text-xs">
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                {/* Featured Image and Author Actions */}
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-4 bg-gray-100">
                    <img
                        src={filePreview}
                        alt={post?.title}
                        className="rounded-xl max-w-full max-h-96"
                    />
                    {/* Author Actions - Desktop */}
                    {isAuthor && (
                        <div className="hidden md:flex absolute right-4 top-4 space-x-2">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-green-500" className="text-sm md:text-base lg:text-lg">Edit</Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={() => setShowConfirm(true)} className="text-sm md:text-base lg:text-lg">
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                {/* Post Content */}
                <div className="prose mx-auto">{parse(post?.content || "")}</div>
                {/* Like/Unlike Buttons */}
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        onClick={handleLikeToggle}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full ${liked ? "bg-blue-500 text-white" : "border"}`}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>{likeCount} Like</span>
                    </button>
                    <button
                        onClick={handleUnlikeToggle}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full ${unliked ? "bg-red-500 text-white" : "border"}`}
                    >
                        <FontAwesomeIcon icon={faThumbsDown} />
                        <span>{unlikeCount} Unlike</span>
                    </button>
                </div>
                {/* Comments Section */}
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-4">Comments:</h2>
                    {/* Display first 3 comments */}
                    {comments.slice(0, 3).map((comment, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-center mb-2">
                                <img 
                                    src={appwriteService.getFilePreview(comment.profilePicture) || user} 
                                    alt={comment.author} 
                                    className="w-10 h-10 rounded-full shadow-lg" 
                                    onError={(e) => {e.target.src = user}}
                                />
                                <Link to={`/profile/${comment?.profilePicture}`} className="font-semibold text-gray-800 ml-2">
                                    {comment.author}
                                </Link>
                                <span className="text-gray-500 text-sm ml-2">{comment.createdAt}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}

                    {/* Show "See More" button if there are more than 3 comments */}
                    {comments.length > 3 && !showAllComments && (
                        <button
                            onClick={() => setShowAllComments(true)}
                            className="text-blue-500 hover:text-blue-700 font-semibold mb-4"
                        >
                            See More Comments ({comments.length - 3} more)
                        </button>
                    )}

                    {/* Display remaining comments when showAllComments is true */}
                    {showAllComments && comments.slice(3).map((comment, index) => (
                        <div key={index + 3} className="mb-4">
                            <div className="flex items-center mb-2">
                                <img 
                                    src={appwriteService.getFilePreview(comment.profilePicture) || user} 
                                    alt={comment.author} 
                                    className="w-10 h-10 rounded-full shadow-lg" 
                                    onError={(e) => {e.target.src = user}}
                                />
                                <Link to={`/profile/${comment?.profilePicture}`} className="font-semibold text-gray-800 ml-2">
                                    {comment.author}
                                </Link>
                                <span className="text-gray-500 text-sm ml-2">{comment.createdAt}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}

                    {/* Show "See Less" button when showing all comments */}
                    {showAllComments && comments.length > 3 && (
                        <button
                            onClick={() => setShowAllComments(false)}
                            className="text-blue-500 hover:text-blue-700 font-semibold mb-4"
                        >
                            See Less
                        </button>
                    )}

                    <textarea
                        className="w-full p-2 border rounded-lg mb-2"
                        rows="4"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Add Comment
                    </button>
                </div>
            </Container>
        </div>
    ) : (
        <p>Post not found</p>
    );
}
