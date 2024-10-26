import React,{useEffect, useState} from 'react'
import appwriteService from "../AppWrite/config"
import {Container, PostCard} from "../Component"
import {useSelector} from "react-redux"

const Home = () => {
  const authStatus = useSelector((state) => state.auth.status); // Get auth status from Redux
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts([]);
        if (response) {
          setPosts(response.documents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
  if (!authStatus || posts.length === 0) {
    return (
      <div className='w-full py-8 mt-4 text-center'>
        <Container>
          <div className='flex flex-wrap'>
            <div className='p-2 w-full'>
              <h1 className='text-3xl font-bold hover:text-gray-500'>
                Login to read post
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

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

export default Home