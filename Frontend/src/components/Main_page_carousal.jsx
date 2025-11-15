
import React from "react";
import { motion } from "framer-motion";
import { Carousel, Card } from "../components/ui/apple-cards-carousel";

export function Main_page_carousal() {
  const cards = data.map((card, index) => (
    <Card key={card.title} card={card} index={index} />
  ));

  return (
    <div className="w-full py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 relative inline-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          ✨ Features
          <span className="absolute left-1/2 -bottom-2 w-16 h-[3px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transform -translate-x-1/2"></span>
        </motion.h2>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-12">
          Explore the core features of <span className="font-semibold">Mentor Connect</span> — designed to empower both mentors and mentees with seamless collaboration, guidance, and growth 🚀
        </p>

        {/* Carousel */}
        <Carousel items={cards} />
      </div>
    </div>
  );
}

// ----- Dummy Contents (same structure, but styled better) -----
const DummyWrapper = ({ children }) => (
  <motion.div
    className="backdrop-blur-lg bg-white/10 dark:bg-black/20 border border-white/20 rounded-3xl shadow-xl p-8 md:p-14 mb-6 flex flex-col items-center gap-6"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const DummyContent1 = () => (
  <DummyWrapper>
    <p className="text-gray-200 text-lg md:text-2xl font-sans text-center leading-relaxed">
      <span className="font-bold text-cyan-400">
        Mentor Connect allows students to easily explore and connect
      </span>{" "}
      with experienced mentors across various domains. Profiles include
      profession, skills, and expertise so mentees can make{" "}
      <span className="font-semibold text-purple-400">informed choices</span>.
    </p>
    <img
      src="https://assets.aceternity.com/macbook.png"
      alt="Mentor discovery"
      className="rounded-xl shadow-2xl w-full md:w-1/2 object-contain transform hover:rotate-1 hover:scale-105 transition"
    />
  </DummyWrapper>
);

const DummyContent2 = () => (
  <DummyWrapper>
    <p className="text-gray-200 text-lg md:text-2xl font-sans text-center leading-relaxed">
      <span className="font-bold text-cyan-400">Role-Based Authentication</span>{" "}
      ensures a secure and personalized experience for both mentors and mentees,
      with{" "}
      <span className="font-semibold text-purple-400">separate dashboards</span>{" "}
      and protected routes using JWT + HTTP-only cookies.
    </p>
    <img
      src="https://assets.aceternity.com/macbook.png"
      alt="Authentication"
      className="rounded-xl shadow-2xl w-full md:w-1/2 object-contain hover:scale-105 transition"
    />
  </DummyWrapper>
);

const DummyContent3 = () => (
  <DummyWrapper>
    <p className="text-gray-200 text-lg md:text-2xl font-sans text-center leading-relaxed">
      <span className="font-bold text-cyan-400">Discussion Forum</span> fosters
      collaboration. Ask questions, share knowledge, and{" "}
      <span className="font-semibold text-purple-400">
        engage with mentors + peers
      </span>{" "}
      in topic-based threads.
    </p>
    <img
      src="https://assets.aceternity.com/macbook.png"
      alt="Forum"
      className="rounded-xl shadow-2xl w-full md:w-1/2 object-contain hover:scale-105 transition"
    />
  </DummyWrapper>
);

const DummyContent4 = () => (
  <DummyWrapper>
    <p className="text-gray-200 text-lg md:text-2xl font-sans text-center leading-relaxed">
      The <span className="font-bold text-cyan-400">AI Assistant</span> is your
      24/7 personal guide 🤖. Ask technical questions, seek project help, or
      get concept clarity instantly.
    </p>
    <img
      src="https://i.ibb.co/YBpXKYrZ/Screenshot-2025-06-26-152338.png"
      alt="AI Assistant"
      className="rounded-xl shadow-lg w-full md:w-1/2 object-contain hover:scale-105 transition"
    />
  </DummyWrapper>
);

const DummyContent5 = () => (
  <DummyWrapper>
    <p className="text-gray-200 text-lg md:text-2xl font-sans text-center leading-relaxed">
      <span className="font-bold text-cyan-400">JWT Authentication</span> with
      HTTP-only cookies keeps accounts{" "}
      <span className="font-semibold text-purple-400">safe & secure</span>,
      preventing token theft and ensuring persistent sessions.
    </p>
    <img
      src="https://assets.aceternity.com/macbook.png"
      alt="JWT security"
      className="rounded-xl shadow-2xl w-full md:w-1/2 object-contain hover:scale-105 transition"
    />
  </DummyWrapper>
);

const DummyContent6 = () => (
  <DummyWrapper>
    <p className="text-gray-200 text-lg md:text-2xl font-sans text-center leading-relaxed">
      Built with <span className="font-bold text-cyan-400">Vite + Tailwind</span>{" "}
      and deployed on{" "}
      <span className="font-semibold text-purple-400">Vercel</span> 🚀 for a
      fast, modern, and responsive UI.
    </p>
    <img
      src="https://assets.aceternity.com/macbook.png"
      alt="Modern UI"
      className="rounded-xl shadow-2xl w-full md:w-1/2 object-contain hover:scale-105 transition"
    />
  </DummyWrapper>
);

const data = [
  {
    category: "Mentor Discovery",
    title: "Browse and connect with experienced mentors",
    content: <DummyContent1 />,
  },
  {
    category: "Role-Based Authentication",
    title: "Secure login flows for Mentors & Mentees",
    content: <DummyContent2 />,
  },
  {
    category: "Discussion Forum",
    title: "Engage with mentors & peers in topic threads",
    content: <DummyContent3 />,
  },
  {
    category: "AI Assistant",
    title: "Instant Q&A and guidance with AI bot",
    content: <DummyContent4 />,
  },
  {
    category: "JWT Security",
    title: "Protected routes with tokens + cookies",
    content: <DummyContent5 />,
  },
  {
    category: "Modern UI + Deployment",
    title: "Fast, responsive frontend with Vite + Tailwind",
    content: <DummyContent6 />,
  },
];
