import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../Component/index.js";
import {
  Bell,
  Globe,
  Home,
  MessageCircle,
  Moon,
  Search,
  Sun,
  Upload,
  Video,
  TrendingUp,
  Mic
} from "lucide-react";

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

const VideoCard = ({ video, size = "small" }) => (
  <div className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
    <img
      src={video.thumbnail}
      alt={video.title}
      className={`object-cover w-full ${size === "large" ? "h-48" : "h-36"}`}
      onError={(e) => {
        e.target.src = "/placeholder.svg"; // Fallback image if thumbnail fails to load
      }}
    />
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
      <h3 className="text-white font-semibold mb-2">{video.title}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <span>{video.views} views</span>
        {video.likes && (
          <>
            <span>•</span>
            <span>{video.likes} likes</span>
          </>
        )}
        {video.comments && (
          <>
            <span>•</span>
            <span>{video.comments} comments</span>
          </>
        )}
      </div>
    </div>
  </div>
);

export default function Demo() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeMenuItem, setActiveMenuItem] = useState("Home Page");
  const [searchQuery, setSearchQuery] = useState("");

  // Apply dark mode class and save preference
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const menuItems = [
    { name: "Home Page", icon: Home },
    { name: "Popular Video", icon: Video },
    { name: "Trendy", icon: TrendingUp },
    { name: "Live Show", icon: MessageCircle, badge: "Live" },
  ];

  const categories = ["Today", "Business Idea", "Motivation", "Life Story", "Problem solve"];

  const featuredVideos = [
    {
      title: "Give More, Get More",
      author: "Ahmad Deedat",
      views: "36,567",
      likes: "2,614",
      comments: "589",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Mera Dil Badal De",
      author: "Hafiz Muhammad",
      views: "36,567",
      likes: "2,614",
      comments: "589",
      thumbnail: "/placeholder.svg"
    }
  ];

  const popularVideos = Array(4).fill().map((_, index) => ({
    title: `Video Title ${index + 1}`,
    views: "32,044",
    likes: "49,206",
    thumbnail: "/placeholder.svg"
  }));

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  const handleVoiceSearch = () => {
    // Implement voice search functionality here
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onresult = (event) => {
        setSearchQuery(event.results[0][0].transcript);
      };
      recognition.start();
    } else {
      alert("Voice search is not supported in your browser");
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="grid grid-cols-[240px_1fr] h-screen dark:bg-gray-900">
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

            <section>
              <h2 className="text-sm font-semibold dark:text-white mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <SidebarMenuItem
                    key={category}
                    item={{ name: category }}
                    isActive={activeMenuItem === category}
                    onClick={setActiveMenuItem}
                  />
                ))}
              </div>
            </section>
          </div>
        </aside>

        <main className="flex flex-col h-screen overflow-hidden">
          <header className="border-b dark:border-gray-800 p-4 flex justify-between items-center">
            <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-10 pr-12 py-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleVoiceSearch}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost">
                <Globe className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button size="icon" variant="ghost">
                <Bell className="h-5 w-5" />
              </Button>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Upload className="h-5 w-5 mr-2" />
                Upload
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6 space-y-8">
            <section>
              <h2 className="text-xl font-semibold dark:text-white mb-4">Featured Videos</h2>
              <div className="grid grid-cols-2 gap-4">
                {featuredVideos.map((video, i) => (
                  <VideoCard key={i} video={video} size="large" />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold dark:text-white">Popular Videos</h2>
                <Button variant="link" className="text-yellow-500">
                  See More
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {popularVideos.map((video, i) => (
                  <VideoCard key={i} video={video} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
