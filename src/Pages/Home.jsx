import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Container, PostCard } from "../Component";
import { CirclesWithBar } from 'react-loader-spinner';
import appwriteService from "../AppWrite/config";

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Appwrite
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
  }, [navigate]);

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
      <div className="w-full py-8 mt-4 text-center min-h-[55vh] flex flex-wrap items-center justify-center">
        <Container>
          <div className="p-2 w-full h-full">
            <Link to="/add-post" className="text-3xl font-bold hover:text-blue-600 transition-colors">
              No posts found. Click to add one!
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-full overflow-y-auto">
      <section>
        <h2 className="text-xl md:text-2xl font-semibold dark:text-white mb-4">Featured Blogs</h2>
        <div className="flex flex-wrap gap-4 sm:justify-normal justify-center items-center">
          {posts.map((post) => (
            <div key={post.$id} className="w-full max-w-[310px] p-2">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
