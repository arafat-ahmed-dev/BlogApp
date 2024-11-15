import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from "react-router-dom";
import { Home, Moon, Search, Sun, Video, User, PlusSquare, Menu, X } from "lucide-react";
import { Button, Logo } from "../Component";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import authService from "../AppWrite/Auth";
import { useForm } from "react-hook-form";

const ShimmerEffect = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
        </div>
    </div>
);

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
    </button>
);

function Layout() {
    const dispatch = useDispatch();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [activeMenuItem, setActiveMenuItem] = useState("Home Page");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const menuItems = [
        { name: "Home Page", icon: Home, to: "/" },
        { name: "My Posts", icon: Video, to: "/my-posts" },
        { name: "Add Post", icon: PlusSquare, to: "/add-post" },
        { name: "Profile", icon: User, to: "/profile" },
    ];

    const { register, handleSubmit } = useForm();

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
        localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
    };

    const handleMenuItemClick = (item) => {
        setActiveMenuItem(item.name);
        navigate(item.to);
        setIsSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const search = (data) => {
        setSearchQuery(data.search);
    }

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
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [dispatch]);

    return (
        <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
            <div className="md:grid md:grid-cols-[240px_1fr] min-h-screen dark:bg-gray-900 h-full">
                {/* Mobile Header */}
                <header className="md:hidden border-b dark:border-gray-800 p-4 flex flex-col gap-5 justify-between items-center">
                    <div className="flex justify-between items-center w-full">
                        <Button size="icon" variant="ghost" onClick={toggleSidebar}
                            className="px-[8px] py-[6px]"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <Link to="/" className="flex gap-2 items-center">
                            <span className="text-yellow-400 text-xl">
                                <Logo width="30px" />
                            </span>
                            <h1 className="font-semibold dark:text-white">BlogVerse</h1>
                        </Link>
                        <Button size="icon" variant="ghost" onClick={toggleDarkMode}
                            className="px-[8px] py-[6px] "
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                    </div>
                    <div className="flex-1 max-w-xl relative w-full">
                        <form onSubmit={handleSubmit(search)} className="flex-1 max-w-xl relative">
                            <input
                                {...register("search")}
                                type="search" 
                                placeholder="Search posts..."
                                className="pl-10 pr-5 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-full w-full border border-black"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </form>
                    </div>
                </header>

                {/* Sidebar */}
                <aside className={`
          fixed md:static inset-0 z-50 bg-white dark:bg-gray-900
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 border-r dark:border-gray-800 p-4
          w-[240px]
        `}>
                    <Link to="/" className="hidden md:flex gap-2 mb-8 justify-left h-fit items-center">
                        <span className="text-yellow-400 text-xl">
                            <Logo width="30px" />
                        </span>
                        <h1 className="font-semibold dark:text-white">BlogVerse</h1>
                    </Link>

                    <div className="space-y-6">
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-sm font-semibold dark:text-white">Menu</h2>
                                <Button size="icon" variant="ghost" onClick={toggleSidebar}
                                    className="md:hidden px-[8px] py-[6px]"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                            {isLoading ? (
                                <ShimmerEffect />
                            ) : (
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
                            )}
                        </section>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-y-auto">
                    <header className="hidden md:flex border-b dark:border-gray-800 p-4 sm:gap-4 justify-between items-center">
                        <form onSubmit={handleSubmit(search)} className="flex-1 max-w-xl relative">
                            <input
                                {...register("search")}
                                type="search"
                                placeholder="Search posts..."
                                className="pl-10 pr-5 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-full w-full border border-black"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </form>
                        <div className="flex items-center gap-4">
                            <Button size="icon" variant="ghost" onClick={toggleDarkMode}
                                className="px-2 md:px-3 py-2 md:py-3"
                            >
                                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </div>
                    </header>
                    <div className="w-full min-w-[320px] flex-1 overflow-y-auto md:p-6 p-2 space-y-8 border-black">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}

export default Layout;
