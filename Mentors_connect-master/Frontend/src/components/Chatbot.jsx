import axios from "axios";
import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello, I am Jarvis! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const response = await axios.post(
      "https://mentor-connect-api.onrender.com/chat-bot",
      { query: input },
      { withCredentials: true }
    );
    const result = response.data;
    const botReply = { text: result, sender: "bot" };
    setMessages((prev) => [...prev, botReply]);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl h-[80vh] mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden mt-10 border border-gray-200">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-5 py-3 rounded-2xl text-base leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 text-base"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-5 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition font-medium shadow-md text-base"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
