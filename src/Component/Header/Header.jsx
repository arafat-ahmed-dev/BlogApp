import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
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
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="py-3 shadow bg-gray-500 w-full">
      <Container>
        <nav className="flex items-center justify-between w-full">
          {/* Logo Section */}
          <div className="mr-4">
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
                <span className="text-xl">✖</span> // Close icon
              ) : (
                <span className="text-xl">☰</span> // Hamburger icon
              )}
            </button>
          </div>

          {/* Nav Items */}
          <ul
            className={`fixed top-0 left-0 h-full w-1/2 bg-gray-700 p-4 z-40 transition-transform duration-300 ease-in-out transform ${
              isMobileMenuOpen
                ? "translate-x-0 "
                : "-translate-x-full md:w-[50%]"
            } md:flex md:relative md:translate-x-0 md:h-auto md:bg-transparent md:p-0 md:ml-auto`}
          >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name} className="mb-4 md:mb-0 ">
                  <button
                    onClick={() => {
                      navigate(item.slug);
                      setIsMobileMenuOpen(false); // Close menu on navigate
                    }}
                    className="block w-full text-left px-6 py-2 duration-200 text-black hover:bg-zinc-100 md:hover:bg-gray-700 md:text-white rounded-full md:inline-block md:w-auto md:px-4 md:py-2"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className="mb-4 md:mb-0">
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
