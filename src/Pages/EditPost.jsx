import React, { useEffect, useState } from 'react'
import { Container, PostForm } from "../Component"
import appwriteService from "../AppWrite/config"
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
    const [post, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPost = async () => {
            if (slug) {
                try {
                    const response = await appwriteService.getPosts();
                    const foundPost = response.documents.find((post) => post.slug === slug);
                    if (foundPost) {
                        setPosts(foundPost);
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                } finally {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                }
            } else {
                navigate('/');
            }
        };
        fetchPost();
    }, [slug, navigate]);
    
    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                        </div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="flex justify-end">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost