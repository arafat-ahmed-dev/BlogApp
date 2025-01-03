import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from "react-router-dom";
import { Home, Moon, Search, Sun, Video, User, PlusSquare, Menu, X } from "lucide-react";
import { Logo } from "../Component";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import authService from "../AppWrite/Auth";

const SidebarMenuItem = ({ item, isActive, onClick, loading }) => {
    if (loading) {
        return (
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        );
    }
    return (
        <button
            className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors dark:text-white 
          ${isActive
                    ? "bg-yellow-400 text-white dark:text-black"
                    : "dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-200"}`}
            onClick={() => onClick(item)}
        >
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.name}</span>
        </button>
    );
};

function Layout() {
    const dispatch = useDispatch();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [activeMenuItem, setActiveMenuItem] = useState("Home Page");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const menuItems = [
        { name: "Home Page", icon: Home, to: "/" },
        { name: "My Posts", icon: Video, to: "/my-posts" },
        { name: "Add Post", icon: PlusSquare, to: "/add-post" },
        { name: "Profile", icon: User, to: "/profile" },
    ];

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
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
            })
            .finally(() => {
                setTimeout(() => setLoading(false), 1000);
            });
    }, [dispatch]);

    const MobileShimmerHeader = () => (
        <div className="w-full p-4 flex flex-col gap-5">
            <div className="flex justify-between items-center w-full">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
    );

    const DesktopShimmerHeader = () => (
        <div className="w-full p-4 flex justify-between items-center gap-5">
            <div className="flex-1 max-w-xl h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
    );

    const ShimmerSidebar = () => (
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ))}
            </div>
        </div>
    );


    return (
        <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
            <div className="md:grid md:grid-cols-[240px_1fr] min-h-screen dark:bg-gray-900 h-full">
                {/* Mobile Header */}
                <header className="md:hidden border-b dark:border-gray-800 bg-yellow-400 dark:bg-gray-900 p-4 flex flex-col gap-5 justify-between items-center">
                    {loading ? <MobileShimmerHeader /> : (
                        <>
                            <div className="flex justify-between items-center w-full">
                                <button size="icon" variant="ghost" onClick={toggleSidebar}
                                    className="px-[8px] py-1.5 dark:text-white text-black"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                                <Link to="/" className="flex gap-2 items-center">
                                    <span className="text-yellow-400 text-xl">
                                        <Logo width="30px" />
                                    </span>
                                    <h1 className="font-semibold dark:text-white">BlogVerse</h1>
                                </Link>
                                <button size="icon" variant="ghost" onClick={toggleDarkMode}
                                    className="px-1.5 py-1.5 dark:text-white text-black"
                                >
                                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </button>
                            </div>
                            <div className="flex-1 max-w-xl relative w-full">
                                <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
                                    <input
                                        type="search"
                                        placeholder="Search posts..."
                                        className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full w-full border border-black dark:text-white text-black"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <Search className="h-4 w-4 text-gray-500" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </header>

                {/* Sidebar */}
                <aside className={`
                    fixed md:static inset-0 z-50 bg-white dark:bg-gray-900
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 border-r dark:border-gray-800 p-4
                    w-[240px]
                `}>
                    {loading ? <ShimmerSidebar /> : (
                        <>
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
                                        <button size="icon" variant="ghost" onClick={toggleSidebar}
                                            className="md:hidden px-1 py-1 dark:text-white text-black"
                                        >
                                            <X className="h-5 w-5 dark:text-white text-black" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {menuItems.map((item) => (
                                            <SidebarMenuItem
                                                key={item.name}
                                                item={item}
                                                isActive={activeMenuItem === item.name}
                                                onClick={handleMenuItemClick}
                                                loading={loading}
                                            />
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-y-auto">
                    <header className="hidden md:flex border-b dark:border-gray-800 bg-yellow-400 dark:bg-gray-900 p-4 justify-between gap-5 items-center">
                        {loading ? <DesktopShimmerHeader /> : (
                            <>
                                <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
                                    <input
                                        type="search"
                                        placeholder="Search posts..."
                                        className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full w-full border border-black dark:text-white text-black"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <Search className="h-4 w-4 text-gray-500" />
                                    </button>
                                </form>

                                <div className="flex items-center gap-4">
                                    <button size="icon" variant="ghost" onClick={toggleDarkMode}
                                        className="px-1.5 py-1.5 dark:text-white text-black"
                                    >
                                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </>
                        )}
                    </header>
                    <div className="w-full min-w-[320px] h-full min-h-full flex-1 p-6 dark:bg-gray-900 bg-white space-y-8 border-black">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;
