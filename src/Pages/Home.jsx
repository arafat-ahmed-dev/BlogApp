import React, { useEffect, useState } from 'react';
import appwriteService from "../AppWrite/config";
import { Container, PostCard } from "../Component";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CirclesWithBar } from 'react-loader-spinner'; // Import the loader

const Home = () => {
  const authStatus = useSelector((state) => state.auth.status); // Get auth status from Redux
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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
        // Set a minimum loading time of 1 second
        setTimeout(() => {
          setLoading(false); // Set loading to false after 1 second
        }, 1000);
      }
    };

    fetchPosts();
  }, []);

  // After loading is complete, check auth status
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

  if (!authStatus || posts.length === 0) {
    return (
      <div className='w-full py-8 mt-4 text-center'>
        <Container>
          <div className='flex flex-wrap'>
            <div className='p-2 w-full'>
              <Link to="/login" className='text-3xl font-bold'>
                Login to read post
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  console.log(posts);

  return (
    <div className='w-full py-8'>
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