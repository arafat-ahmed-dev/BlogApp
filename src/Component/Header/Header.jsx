import React, { useState } from "react";
import { Logo } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);

  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "My Posts",
      slug: "/my-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
    {
      name: "Profile",
      slug: "/profile",
      active: authStatus,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="py-3 shadow bg-gray-500 w-full flex items-center justify-between h-[80px] lg:px-9 px-6">
      <nav className="w-full overflow-hidden flex items-center justify-between">
        {/* Logo Section */}
        <div className="mr-4 w-fit flex items-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                  <path d="M 2 2 L 48 48 M 2 48
                  L 48 2" stroke="black" strokeWidth="4" />
                </svg>
              </span> // Close icon
            ) : (
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                  <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
                </svg>
              </span> // Hamburger icon
            )}
          </button>
        </div>

        {/* Nav Items */}
        <ul
          className={`fixed top-0 left-0 h-full md:flex gap-4 md:gap-2 md:justify-end w-1/2 md:w-3/4 bg-gray-700 p-4 z-40 transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:w-[40%]"
            } md:flex md:relative md:translate-x-0 md:h-auto md:bg-transparent md:p-0 md:ml-auto`}
        >
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name} className="mb-4 md:mb-0 grid items-center">
                <h6
                  onClick={() => {
                    navigate(item.slug);
                    setIsMobileMenuOpen(false); // Close menu on navigate
                  }}
                  className=" text-left md:text-center w-full px-6 py-2 sm:hover:text-black sm:font-medium md:hover:text-white duration-200 md:font-medium hover:bg-zinc-100 md:hover:bg-gray-700 text-white rounded-full md:inline-block md:w-auto md:px-4 md:py-2"
                >
                  {item.name}
                </h6>
              </li>
            ) : null
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
