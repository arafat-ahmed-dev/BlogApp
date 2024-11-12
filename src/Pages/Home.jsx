import React, { useEffect, useState } from 'react';
import appwriteService from "../AppWrite/config";
import { Container, PostCard } from "../Component";
import { Link } from "react-router-dom";
import { CirclesWithBar } from 'react-loader-spinner';

const Home = () => {
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
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchPosts();
  }, []);

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
      <Container>
        <div className='w-full flex flex-wrap justify-center gap-5'>
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
