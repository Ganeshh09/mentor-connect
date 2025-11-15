import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Discussion_forum = () => {
  const [query, setQuery] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  // Fetch available rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("https://mentor-connect-api.onrender.com/get-rooms", {
          withCredentials: true,
        });
        setRooms(response.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleClick = async (roomName = query) => {
    if (!roomName) return alert("Please enter or select a room!");

    try {
      const response = await axios.post(
        "https://mentor-connect-api.onrender.com/validation-for-forum",
        { query: roomName },
        { withCredentials: true }
      );

      if (response.data) {
        navigate(`/messages/${roomName}`);
      } else {
        alert("Error! Task failed successfully.");
        navigate("/student-login");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="bg-gray-800 h-screen w-screen flex">
      {/* Sidebar with available rooms */}
      <div className="w-1/4 bg-gray-900 p-6 text-white flex flex-col gap-4">
        <h2 className="text-xl font-semibold border-b border-gray-600 pb-2">
          Available Rooms
        </h2>
        {rooms.length > 0 ? (
          rooms.map((room, idx) => (
            <button
              key={idx}
              className="bg-gray-700 hover:bg-cyan-600 px-4 py-2 rounded-md text-left transition"
              onClick={() => handleClick(room)}
            >
              {room}
            </button>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No rooms available</p>
        )}
      </div>

      {/* Main join form */}
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col gap-5 bg-gray-700 p-10 rounded-lg shadow-xl">
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-2xl text-white">
              Which room you want to join?
            </legend>
            <input
              type="text"
              className="input px-4 py-2 rounded-md"
              placeholder="Type here"
              onChange={(e) => setQuery(e.target.value.toLowerCase())}
            />
            <p className="label text-sm text-gray-300">
              Please enter a valid roomId
            </p>
          </fieldset>
          <button
            className="btn bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition"
            onClick={() => handleClick()}
          >
            🚪 Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Discussion_forum;
