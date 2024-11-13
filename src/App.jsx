import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from "react-router-dom";
import { Container, PostCard } from "./Component";
import { CirclesWithBar } from 'react-loader-spinner';
import appwriteService from "./AppWrite/config";
import { Home, Moon, Search, Sun, Video, User, PlusSquare } from "lucide-react";
import { Button } from "./Component";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import { clearNotification } from "./store/notification"; // Clear notification action
import Footer from "./Component/Footer/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from "./AppWrite/Auth";

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

function App() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification.message);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeMenuItem, setActiveMenuItem] = useState("Home Page");
  const [searchQuery, setSearchQuery] = useState("");
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home Page", icon: Home, to: "/" },
    { name: "My Posts", icon: Video, to: "/my-posts" },
    { name: "Add Post", icon: PlusSquare, to: "/add-post" },
    { name: "Profile", icon: User, to: "/profile" },
  ];

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

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item.name);
    navigate(item.to);
  };

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        dispatch(logout());
      });
  }, [dispatch]);

  useEffect(() => {
    if (notification) {
      toast(notification, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      dispatch(clearNotification()); // Clear notification after displaying
    }
  }, [notification, dispatch]);

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
                {menuItems.map((item) => (
                  <SidebarMenuItem
                    key={item.name}
                    item={item}
                    isActive={activeMenuItem === item.name}
                    onClick={handleMenuItemClick}
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
                className="pl-10 pr-12 py-2 bg-gray-100 dark:bg-gray-800 rounded-full w-full border border-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </form>

            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>

      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
