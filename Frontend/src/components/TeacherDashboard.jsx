import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const [teacherData, setTeacherData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch teacher info on component mount
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await axios.get("https://mentor-connect-api.onrender.com/get-info", {
          withCredentials: true,
        });
        setTeacherData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError("You are not logged in or session expired.");
        setLoading(false);
        navigate("/teacher-login"); // redirect to login if unauthorized
      }
    };

    fetchTeacherData();
  }, [navigate]);

  // Fetch upcoming Calendly events
  const fetchUpcomingEvents = async () => {
    if (!teacherData) return;

    try {
      const res = await axios.post(
        "https://mentor-connect-api.onrender.com/get-upcoming-events",
        {
          token: teacherData.calendlyToken, // make sure token is saved in DB or retrieved after OAuth
          ownerlink: teacherData.email, // using teacher email as ownerlink
        },
        { withCredentials: true }
      );
      setUpcomingEvents(res.data);
    } catch (err) {
      console.error("Error fetching upcoming events:", err);
    }
  };

  useEffect(() => {
    if (teacherData) fetchUpcomingEvents();
  }, [teacherData]);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.get("https://mentor-connect-api.onrender.com/logout", {
        withCredentials: true,
      });
      navigate("/teacher-login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={teacherData.image_link || "/default-avatar.png"}
            alt="Teacher Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{teacherData.name}</h1>
            <p className="text-gray-500">{teacherData.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Students</h2>
          <p className="text-3xl font-bold text-blue-500">
            {teacherData.total_students}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Sessions</h2>
          <p className="text-3xl font-bold text-green-500">
            {teacherData.total_sessions}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700">Upcoming Events</h2>
          <p className="text-3xl font-bold text-purple-500">
            {upcomingEvents.length}
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500">No upcoming sessions scheduled.</p>
        ) : (
          <ul className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-gray-500">
                    {new Date(event.start_time).toLocaleString()}
                  </p>
                </div>
                <a
                  href={event.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
