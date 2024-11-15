import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Container, PostCard } from "../Component";
import { CirclesWithBar } from 'react-loader-spinner';
import appwriteService from "../AppWrite/config";

const ShimmerPostCard = () => (
  <div className="w-full max-w-[310px] p-2">
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

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
      <div className="flex-1 min-h-full overflow-y-auto">
        <section>
          <div className="animate-pulse mb-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
          <div className="flex flex-wrap gap-4 sm:justify-normal justify-center items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ShimmerPostCard key={i} />
            ))}
          </div>
        </section>
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
