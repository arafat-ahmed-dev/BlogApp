import React, { useEffect, useState } from 'react';
import appwriteService from "../AppWrite/config";
import { Container, PostCard } from "../Component";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { CirclesWithBar } from 'react-loader-spinner';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts([]);
        if (response) {
          setPosts(response.documents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setTimeout(() => {
          setSuccessMessage(location.state?.successMessage);
          setLoading(false);
        }, 1000);
      }
    };
    fetchPosts();
  }, []);

  // Show a notification for success messages from location.state (e.g., after logout)
  useEffect(() => {
    if (successMessage) {
      toast(successMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Zoom,
      });
      setSuccessMessage(null); // Clear message after displaying
    }
  }, [successMessage]);

  // Show a notification when logged in successfully
  useEffect(() => {
    if (authStatus) {
      toast("Logged in successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Zoom,
      });
    }
  }, [authStatus]);

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

  if (!authStatus) {
    return (
      <div className='w-full py-8 mt-4 text-center'>
        <Container>
          <div className='flex flex-wrap'>
            <div className='p-2 w-full'>
              <Link to="/login" className='text-3xl font-bold'>
                Login to read posts
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className='w-full py-8 mt-4 text-center min-h-[55vh] flex flex-wrap items-center justify-center '>
        <Container>
          <div>
            <div className='p-2 w-full h-full'>
              <Link to="/add-post" className='text-3xl font-bold'>No posts found</Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className='w-full py-8'>
      <ToastContainer />
      <Container>
        <div className='w-full flex flex-wrap justify-center'>
          {posts.map((post) => (
            <div key={post.$id} className='p-2 w-[305px] sm:w-[320px] md:max-w-[310px] flex flex-wrap'>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Home;
