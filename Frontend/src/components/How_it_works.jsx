import React from "react";
import { Link } from "react-router-dom";

const How_it_works = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-indigo-900 text-slate-100 py-4 px-8 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-extrabold flex items-center tracking-wide">
          <span className="mr-2">🔗</span> Mentor Connect
        </h1>
        <ul className="flex gap-6 items-center">
          <li>
            <Link
              to="/mentors"
              className="hover:bg-indigo-700/20 hover:text-white transition-all px-4 py-2 rounded-xl font-medium duration-300"
            >
              Our Mentors
            </Link>
          </li>
          <li>
            <Link
              to="/workings"
              className="hover:bg-indigo-700/20 hover:text-white transition-all px-4 py-2 rounded-xl font-medium duration-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="hover:bg-indigo-700/20 hover:text-white transition-all px-4 py-2 rounded-xl font-medium duration-300"
            >
              Home
            </Link>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-4xl font-bold mb-6 text-indigo-900">
          👥 How Mentor Connect Works
        </h2>
        <p className="text-lg leading-relaxed mb-8">
          Mentor Connect is a platform that bridges the gap between students and
          mentors. It allows students to explore mentor profiles, view their
          skills, book sessions, and track learning progress, while mentors can
          manage their mentees and offer guidance in fields like MERN stack, AI,
          ML, and more.
        </p>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-semibold text-indigo-800 mb-3">
              🚀 Features
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>🔐 User Authentication (Students & Mentors)</li>
              <li>📄 Mentor Profiles (Name, Email, Profession, Skills, Degree)</li>
              <li>📘 Skill Roadmaps (MERN, AI, ML)</li>
              <li>🏷️ Skill Tags with Badge UI</li>
              <li>🗓️ Session Booking *(expandable)*</li>
              <li>🧾 Progress Tracker *(expandable)*</li>
              <li>📊 Time Spent Analytics</li>
              <li>🔍 Search & Filter for Mentors</li>
              <li>🌐 Backend API Integration</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-indigo-800 mb-3">
              🛠️ Tech Stack
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Frontend: React.js, Tailwind CSS</li>
              <li>Backend: Node.js, Express.js</li>
              <li>Database: MongoDB (Mongoose)</li>
              <li>Authentication: JWT (Cookies)</li>
              <li>Routing: React Router DOM</li>
              <li>HTTP Client: Axios</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default How_it_works;
