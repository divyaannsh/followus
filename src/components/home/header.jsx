import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/slices/authSlice";
import MainLogo from "../../../public/img/mainLogo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  const isAuthenticated = useSelector((state) => state.auth.authToken);
  const username = useSelector((state) => state.auth.user);

  console.log("isAuthenticated", isAuthenticated);

  // Scroll handler to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { title: "Templates", href: "/template" },
    { title: "My Links", href: "/admin" },
    // { title: "Discover", href: "/discover" },
    // { title: "Pricing", href: "/pricing" },
    { title: "Blog", href: "/blog" },
  ];



  const handleProtectedNavigation = (href) => {
    console.log("hrefhref", href);

    const protectedRoutes = ["/admin"]; // sirf yeh route protected hoga

    if (!isAuthenticated && protectedRoutes.includes(href)) {
      setShowAuthModal(true);
    } else {
      router.push(href);
    }
  };


  const handleLogout = useCallback(() => {
    dispatch(logoutSuccess());
    toast.success("Logged out successfully");
    router.push("/login");
  }, [dispatch, router]);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg p-4 flex items-center justify-between md:w-[calc(100%-140px)] md:mx-[70px] md:top-2 md:rounded-lg"
      style={{
        backgroundImage: "url('/img/headerBg1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out"
      }}
    >
      {/* Mobile: Left Menu Icon */}
      <button className="md:hidden" onClick={() => setMobileOpen(true)}>
        <MenuIcon />
      </button>

      {/* Desktop: Logo */}
      <Link href="/" className="hidden md:block">
        <Image src={MainLogo} alt="logo" width={50} height={50} className="cursor-pointer" />
      </Link>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 ml-6">
        {navLinks.map((item) => (
          <button
            key={item.title}
            className="text-lg  text-gray-800 dark:bg-gray-900 dark:text-gray-100"
            onClick={() => handleProtectedNavigation(item.href)}
          >
            {item.title}
          </button>
        ))}
      </nav>

      {/* Authentication Buttons (Desktop) */}
      <div className="hidden md:flex ml-auto items-center space-x-4">
        {isAuthenticated ? (
          <div className="relative"><span>
            <b className=" text-gray-800 dark:bg-gray-900 dark:text-gray-100">Hey {username}</b>
            <button className="ml-2  text-gray-800 dark:bg-gray-900 dark:text-gray-100" onClick={() => setShowProfileModal(!showProfileModal)}>
              <AccountCircleIcon fontSize="large" />
            </button>
          </span>
            {showProfileModal && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 flex flex-col text-gray-800">
                <Link href="/profileDetail" className="px-4 py-2 hover:bg-gray-200">Dashboard</Link>
                {/* <Link href="/personal-details" className="px-4 py-2 hover:bg-gray-200">Personal Details</Link> */}
                <Link href="/forgotPassword" className="px-4 py-2 hover:bg-gray-200">Forgot Password</Link>
                <button className="px-4 py-2 text-left hover:bg-gray-200" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-800 bg-gray-200 dark:bg-gray-200 dark:text-gray-100 px-4 py-2 rounded-md">Log in</Link>
            <Link href="/signup" className="bg-gray-800 text-white px-4 py-2 rounded-md">Sign up free</Link>
          </div>
        )}
      </div>

      {/* Mobile: Profile Icon with Dropdown */}
      {isAuthenticated && (
        <div className="relative md:hidden">
          <button onClick={() => setShowProfileModal(!showProfileModal)}>
            <AccountCircleIcon fontSize="large" />
          </button>
          {showProfileModal && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 flex flex-col">
              <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-200">Dashboard</Link>
              {/* <Link href="/personal-details" className="px-4 py-2 hover:bg-gray-200">Personal Details</Link> */}
              <Link href="/forgotPassword" className="px-4 py-2 hover:bg-gray-200">Forgot Password</Link>
              <button className="px-4 py-2 text-left hover:bg-gray-200" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50  flex justify-start">
          <div className="bg-white w-64 h-full shadow-lg p-4">
            <button className="mb-4" onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </button>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((item) => (
                <button
                  key={item.title}
                  className="text-lg hover:text-gray-500"
                  onClick={() => handleProtectedNavigation(item.href)}
                >
                  {item.title}
                </button>
              ))}
              {!isAuthenticated && (
                <>
                  <Link href="/login" className="bg-gray-200 px-4 py-2 rounded-md text-center">
                    Log in
                  </Link>
                  <Link href="/signup" className="bg-gray-800 text-white px-4 py-2 rounded-md text-center">
                    Sign up free
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[90%] max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Login Required</h2>
            <p className="text-lg text-gray-600 mb-6">You need to log in to access this page.</p>
            <div className="flex justify-center gap-6">
              <Link href="/login" className="bg-gray-600 hover:bg-gray-900 text-white px-6 py-3 rounded-lg shadow-md transition-all">
                Log In
              </Link>
              <button
                className="bg-gray-400 hover:bg-gray-500 px-6 py-3 rounded-lg shadow-md transition-all"
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
