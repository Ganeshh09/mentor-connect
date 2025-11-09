import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Main_page_carousal } from "./Main_page_carousal";
import axios from "axios";
import { motion } from "framer-motion";
import heroImage from "../assets/mentorsconnect-hero-img.webp";

export default function MainPage() {
  const [showProfileSymbol, setShowProfileSymbol] = useState("");
  const [showDashboardSymbol, setShowDashboardSymbol] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const fetchAuthStatus = () => {
    axios
      .get("https://mentor-connect-api.onrender.com/check-student-cookie", {
        withCredentials: true,
      })
      .then((res) => setShowProfileSymbol(res.data.isStudent))
      .catch(() => setShowProfileSymbol(false));
    axios
      .get("https://mentor-connect-api.onrender.com/check-teacher-cookie", {
        withCredentials: true,
      })
      .then((res) => setShowDashboardSymbol(res.data.isTeacher))
      .catch(() => setShowDashboardSymbol(false));
  };


  // 🔹 Unified Logout Function (works for both teacher & student)
  const handleLogout = async () => {
    try {
      await axios.get("https://mentor-connect-api.onrender.com/logout", { withCredentials: true });
      setShowProfileSymbol("");
      setShowDashboardSymbol("");
      navigate("/", { state: { loggedOut: true }, replace: true });
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchAuthStatus();
  }, []);

  // 👇 Refresh auth state when logout triggers navigation
  useEffect(() => {
    if (location.state?.loggedOut) {
      fetchAuthStatus();
    }
  }, [location.state]);

  const navItems = [
    { title: "Our Mentors", href: "/mentors" },
    {
      title: "About",
      href: "/",
      dropdown: [
        { title: "Our Mission", href: "/" },
        { title: "Our Vision", href: "/" },
        { title: "How It Works", href: "/workings" },
      ],
    },
    { title: "Discussion Forum", href: "/discussion-forum" },
    showProfileSymbol
      ? {
          title: <i className="bi bi-person-circle text-xl" />,
          href: "/mentee-profile",
        }
      : showDashboardSymbol
      ? {
          title: "Teachers Dashboard",
          href: "/teacher-dashboard",
        }
      : {
          title: "Login",
          href: "#",
          dropdown: [
            { title: "Login as Mentor", href: "/teacher-login" },
            { title: "Login as Mentee", href: "/student-login" },
          ],
        },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-indigo-900 text-slate-100 py-4 px-8 flex justify-between items-center shadow-lg backdrop-blur-md border-b border-indigo-700/40">
        <h1 className="text-3xl font-extrabold flex items-center tracking-wide">
          <span className="mr-2">🔗</span> Mentor Connect
        </h1>
        <ul className="flex gap-6 items-center">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <Link
                to={item.href}
                className="hover:bg-indigo-700/20 hover:text-white transition-all px-4 py-2 rounded-xl font-medium duration-300"
              >
                {item.title}
              </Link>
              {item.dropdown && (
                <ul className="absolute -left-10 mt-2 bg-white text-gray-800 shadow-2xl rounded-xl hidden group-hover:block w-52 border-t-4 border-indigo-600 z-50">
                  {item.dropdown.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <Link
                        to={subItem.href}
                        className="block py-3 px-4 hover:text-indigo-700"
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* 🔹 Logout Button (if student OR teacher logged in) */}
          {(showProfileSymbol || showDashboardSymbol) && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center justify-center flex-col px-4 py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        <motion.div
          className="relative max-w-5xl mx-auto text-center text-slate-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Connecting Mentors <br /> and Mentees
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-slate-200">
            Mentor Connect is where experience meets ambition. Mentors share
            expertise, guiding mentees through challenges, career choices, and
            skill-building journeys. Together, they create pathways for growth
            and success.
          </p>

          {/* Show Find Mentor button only if mentee logged in */}
          {showProfileSymbol && (
            <Link
              to="/mentors"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-300"
            >
              Find a Mentor
            </Link>
          )}
        </motion.div>
      </section>

      {/* Carousel Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-10 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
              Meet Our Mentors
            </h3>
            <Main_page_carousal />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-gray-200 py-10 mt-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-xl font-semibold mb-3">Mentor Connect</h4>
            <p className="text-sm text-gray-300">
              Empowering mentees and mentors to connect, grow, and succeed.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mentors" className="hover:text-white">
                  Our Mentors
                </Link>
              </li>
              <li>
                <Link to="/discussion-forum" className="hover:text-white">
                  Discussion Forum
                </Link>
              </li>
              <li>
                <Link to="/workings" className="hover:text-white">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3">Get in Touch</h4>
            <p className="text-sm">📧 support@mentorconnect.com</p>
            <p className="text-sm">📍 India</p>
          </div>
        </div>
        <div className="mt-8 border-t border-indigo-700 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Mentor Connect. All rights reserved.
        </div>
      </footer>

      {/* Chatbot Floating Button */}
      <Link
        to="/chat-bot"
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <span className="text-xl">💬</span>
      </Link>
    </>
  );
}
