import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../Component";
import appwriteService from "../AppWrite/config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
      <div className="flex-1 min-h-full overflow-y-auto p-4">
        <div className="flex flex-wrap gap-4 sm:justify-normal justify-center">
          {[1, 2, 3].map((index) => (
            <div key={index} className="w-full max-w-[310px] p-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!authStatus || userPosts.length === 0) {
    return (
      <div className='w-full py-8 mt-4 text-center'>
        <Container>
          <div className='flex flex-wrap'>
            <div className='p-2 w-full'>
              <Link to="/add-post">
              <h1 className='text-3xl font-bold text-black dark:text-white cursor-pointer'>
              You haven't posted anything yet. <br /> Start sharing your thoughts!
              </h1>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }


  return (
    <div className="flex-1 min-h-full overflow-y-auto">
        <div className="flex flex-wrap gap-4 sm:justify-normal justify-center items-center">
          {userPosts.map((post) => (
            <div
              key={post.$id}
              className="w-full max-w-[310px] p-2"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
    </div>
  );
}

export default MyPosts;
