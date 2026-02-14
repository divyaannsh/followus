import Link from "next/link";
import XIcon from "@mui/icons-material/X";
import AddTaskIcon from "@mui/icons-material/AddTask";
import Image from "next/image";
import mainLogo from "../../../public/img/mainLogo.png";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";

const Footer = () => {
  const isAuthenticated = useSelector((state) => state.auth.authToken);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleProtectedNavigation = (href) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      router.push(href);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-[#E3E3E3] to-[#DDEAFF] py-10 px-6 md:px-20 -mb-[10px]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-black">
        {/* Column 1 */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            {[{ name: "Template", link: "/template" }, { name: "My Links", link: "/admin" }, { name: "Blog", link: "/blog" }].map((item, index) => (
              <li key={index}>
                <button className="cursor-pointer hover:underline" onClick={() => handleProtectedNavigation(item.link)}>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 */}

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            {[{ name: "Support", link: "/support" }].map((item, index) => (
              <li key={index}>
                <Link href={item.link} className="cursor-pointer hover:underline">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Buttons & Social Icons */}
      <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row items-center justify-between">
        {/* Buttons */}
      {!isAuthenticated ?   <div className="flex gap-4">
          <Link href="/login">
            <button className="px-4 py-2 border border-black rounded-lg text-gray-800 dark:bg-gray-900 dark:text-gray-100">Log in</button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 border border-black bg-white rounded-lg text-gray-800 dark:bg-gray-900 dark:text-gray-100">Get started for free</button>
          </Link>
        </div> : ""}

        {/* Social Links */}
        <div className="flex flex-wrap items-center gap-6 mt-6 md:mt-0">
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600  text-gray-800 dark:bg-gray-900 dark:text-gray-100">
              <InstagramIcon className="text-3xl" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600  text-gray-800 dark:bg-gray-900 dark:text-gray-100">
              <FacebookIcon className="text-3xl" />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600  text-gray-800 dark:bg-gray-900 dark:text-gray-100">
              <XIcon className="text-3xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Logo & Title */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 gap-6">
        <Image src={mainLogo} alt="followus.link Logo" className="w-20 h-20" />
        <h2 className="text-4xl md:text-[100px] text-[#C0C0C0] font-Arial">followus.link</h2>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[90%] max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Login Required</h2>
            <p className="text-lg text-gray-600 mb-6">You need to log in to access this page.</p>
            <div className="flex justify-center gap-6">
              <button
                className="bg-gray-600 hover:bg-gray-900 text-white px-6 py-3 rounded-lg shadow-md transition-all"
                onClick={() => router.push("/login")}
              >
                Log In
              </button>
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
    </footer>
  );
};

export default Footer;
