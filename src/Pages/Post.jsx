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
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.userData.$id : false;
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const successMessage = location.state?.successMessage || "";

    useEffect(() => {
        if (successMessage) {
            toast.success(` ${successMessage}`, {
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
    }, [slug, navigate]);

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

    const filePreview = post?.featuredImage ? appwriteService.getFilePreview(post?.featuredImage) : "/default-image.jpg";

    return post ? (
        <div className="py-8">
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
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={filePreview}
                        alt={post?.title}
                        className="rounded-xl"
                    />
                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={() => setShowConfirm(true)}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post?.title}</h1>
                </div>
                <div className="browser-css">
                    {post?.content ? parse(post.content) : <p>No content available</p>}
                </div>
            </Container>
        </div>
    ) : null;
}
