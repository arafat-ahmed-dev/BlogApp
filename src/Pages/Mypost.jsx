import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../Component";
import appwriteService from "../AppWrite/config";
import { useSelector } from "react-redux";
import { CirclesWithBar } from 'react-loader-spinner'; 

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth);
  const userPosts = posts?.filter((post) => post.userId === authStatus.userData.userData.$id);

  
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
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
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

  if (!authStatus || userPosts.length === 0) {
    return (
      <div className='w-full py-8 mt-4 text-center'>
        <Container>
          <div className='flex flex-wrap'>
            <div className='p-2 w-full'>
              <h1 className='text-3xl font-bold hover:text-gray-500'>
              You haven't posted anything yet. <br /> Start sharing your thoughts!
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }


  return (
    <div className="w-full py-8">
      <Container>
        <div className="w-full flex flex-wrap justify-center gap-5">
          {userPosts.map((post) => (
            <div
              key={post.$id}
              className="p-2 w-[305px] sm:w-[320px] md:max-w-[310px] flex flex-wrap"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default MyPosts;
