import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Container, PostCard } from "../Component";
import { CirclesWithBar } from 'react-loader-spinner';
import appwriteService from "../AppWrite/config";
import { Bell, Home, MessageCircle, Moon, Search, Sun, Upload, Video, TrendingUp, Mic, LogOut } from "lucide-react";
import { Button } from "../Component";
import authService from "../AppWrite/Auth";

// Reusable components
const SidebarMenuItem = ({ item, isActive, onClick }) => (
  <button
    className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors
      ${isActive
        ? "bg-yellow-400 text-black"
        : "dark:text-gray-400 hover:bg-gray-800"}`}
    onClick={() => onClick(item.name)}
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
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeMenuItem, setActiveMenuItem] = useState("Home Page");
  const [searchQuery, setSearchQuery] = useState("");

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
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  const handleLogout = () => {
    authService.logout().then(() => {
      navigate("/login");
    });
  };

  const menuItems = [
    { name: "Home Page", icon: Home },
    { name: "Popular Video", icon: Video },
    { name: "Trendy", icon: TrendingUp },
    { name: "Live Show", icon: MessageCircle, badge: "Live" },
  ];

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
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="grid grid-cols-[240px_1fr] h-screen dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="border-r dark:border-gray-800 p-4">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="text-yellow-400 text-xl">📖</span>
            <h1 className="font-semibold dark:text-white">Storytelling</h1>
          </Link>

          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold dark:text-white mb-4">Menu</h2>
              <div className="space-y-2">
                {menuItems.map(item => (
                  <SidebarMenuItem
                    key={item.name}
                    item={item}
                    isActive={activeMenuItem === item.name}
                    onClick={setActiveMenuItem}
                  />
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-col h-screen overflow-hidden">
          <header className="border-b dark:border-gray-800 p-4 flex justify-between items-center">
            <form onSubmit={(e) => e.preventDefault()} className="flex-1 max-w-xl relative">
              <input
                type="search"
                placeholder="Search posts..."
                className="pl-10 pr-12 py-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </form>

            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6 space-y-8">
            <section>
              <h2 className="text-xl font-semibold dark:text-white mb-4">Featured Videos</h2>
              <div className="grid grid-cols-2 gap-4">
                {posts.map((post) => (
                  <div key={post.$id} className="p-2 w-[305px] sm:w-[320px] md:max-w-[310px] flex flex-wrap">
                    <PostCard {...post} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
