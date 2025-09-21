import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState("");
  const [isOn, setIsOn] = useState(false);

  const { roomId } = useParams(); // ✅ get roomId from URL
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  // Join room
  useEffect(() => {
    if (roomId) {
      socket.emit("joinroom", roomId);
      setMessages([]); // reset on room change
    }
  }, [roomId]);

  // Auth check + initial fetch
  useEffect(() => {
    const check_cookie = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/check-cookie",
          {},
          { withCredentials: true }
        );
        if (response.data === true) {
          fetchMessages();
        } else {
          navigate("/student-login");
        }
      } catch (err) {
        console.error(err);
        navigate("/student-login");
      }
    };

    const fetchMessages = async () => {
  const response = await axios.get(`http://localhost:5000/get-messages/${roomId}`, {
    withCredentials: true,
  });
  setMessages(response.data);
};

    check_cookie();
  }, [navigate]);

  // Get user info + socket listener
  useEffect(() => {
    const fetchUser = async () => {
      const userinfo = await axios.post(
        "http://localhost:5000/info-for-message",
        {},
        { withCredentials: true }
      );
      setUser(userinfo.data);
    };

    socket.on("newmessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchUser();

    return () => {
      socket.off("newmessage");
    };
  }, []);

  const handleSend = () => {
    if (input.trim() === "" || !roomId) return;
    socket.emit("message", { roomId, text: input, sender: user });
    setInput("");
  };

  const handle_toggle = () => {
    setIsOn((prev) => !prev);
  };

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`flex flex-col max-w-3xl mx-auto h-screen px-6 py-4 ${
        isOn ? "bg-[#0d0d0d]" : "bg-gray-800"
      } text-white rounded-xl shadow-xl font-sans`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-cyan-400 tracking-widest">
          ⚡ Room: {roomId}
        </h2>

        <label className="swap swap-rotate">
          <input
            type="checkbox"
            className="theme-controller"
            onClick={handle_toggle}
          />
          <svg className="swap-off h-8 w-8 fill-black" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,1.41,1.41l.71-.71A1,1,0,0,0,5.64,17Z" />
          </svg>
          <svg className="swap-on h-8 w-8 fill-current" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14..." />
          </svg>
        </label>
      </div>

      {/* Messages */}
      <div
        className={`flex-1 overflow-y-auto space-y-4 p-5 ${
          isOn ? "bg-[#111111]" : "bg-blue-200"
        } rounded-2xl border border-[#1a1a1a] shadow-inner`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-[#1a1a1a] p-4 rounded-xl"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
              {msg.sender?.[0] || "?"}
            </div>
            <div>
              <span className="text-cyan-300 font-semibold">{msg.sender}</span>
              <p className="text-white mt-1">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 mt-5">
        <input
          type="text"
          className={`flex-1 ${
            isOn ? "bg-[#1a1a1a]" : "bg-white"
          } border px-5 py-3 rounded-full ${
            isOn ? "text-white" : "text-black"
          }`}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-br from-cyan-500 to-purple-600 px-6 py-3 rounded-full font-semibold text-white"
        >
          💬 Send
        </button>
      </div>
    </div>
  );
};

export default Message;
