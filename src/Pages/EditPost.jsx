import React, { useEffect, useState } from 'react'
import { Container, PostForm } from "../Component"
import appwriteService from "../AppWrite/config"
import { useNavigate, useParams } from 'react-router-dom'
import { CirclesWithBar } from 'react-loader-spinner';

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
            <div className="flex justify-center items-center h-[80vh]">
                <CirclesWithBar
                    height="100"
                    width="100"
                    color="#3498db"
                    ariaLabel="circles-with-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
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