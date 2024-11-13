import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Container, PostCard } from "../Component";
import { CirclesWithBar } from 'react-loader-spinner';
import appwriteService from "../AppWrite/config";
import { Home, Moon, Search, Sun, Video, User, PlusSquare } from "lucide-react";
import { Button } from "../Component";
import { useSelector } from "react-redux";

// Reusable components
const SidebarMenuItem = ({ item, isActive, onClick }) => (
  <button
    className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors
      ${isActive
        ? "bg-yellow-400 text-black"
        : "dark:text-gray-400 hover:bg-gray-800"}`}
    onClick={() => onClick(item)}
  >
    {item.icon && <item.icon className="h-5 w-5" />}
    <span>{item.name}</span>
    {item.badge && (
      <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
        {item.badge}
      </span>
    )}
  </button>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeMenuItem, setActiveMenuItem] = useState("Home Page");
  const [searchQuery, setSearchQuery] = useState("");
  const authStatus = useSelector((state) => state.auth.status);

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

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  // Menu items array with both sidebar and former header links
  const menuItems = [
    { name: "Home Page", icon: Home, to: "/" },
    { name: "My Posts", icon: Video, to: "/my-posts" },
    { name: "Add Post", icon: PlusSquare, to: "/add-post" },
    { name: "Profile", icon: User, to: "/profile" },
  ];

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item.name);
    navigate(item.to);
  };

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
            <Link to="/add-post" className="text-3xl font-bold">No posts found</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-8 border-black">
      <section>
        <h2 className="text-xl font-semibold dark:text-white mb-4">Featured Blogs</h2>
        <div className="w-fit grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-[305px] sm:w-[320px] md:max-w-[310px] flex flex-wrap">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
