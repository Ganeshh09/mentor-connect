import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [session, setSession] = useState("");
  const [totalStudents, setTotalStudents] = useState("");
  const [eventsData, setEventsData] = useState([]);

  // Redirect to Calendly OAuth if no state is passed
  useEffect(() => {
    const datas = location.state || null;
    if (!datas) {
      const client_id = "WevYWWkis8MWNt14XSQn3JCCksGG72lmRM613IDiaxk";
    const redirect_uri = "https://mentor-connect-api.onrender.com/get-data_OAuth";
    const response_type = "code";

    const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=${response_type}`;

    window.location.href = authUrl;

    } else {
      setEventsData(datas);
    }
  }, [location.state]);

  // Fetch teacher info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://mentor-connect-api.onrender.com/get-info", {
          withCredentials: true,
        });
        setName(response.data.name);
        setEmail(response.data.email);
        setImage(
          response.data.image_link ||
            "https://tse2.mm.bing.net/th/id/OIP.qndmsrE3AcZaAnpLkMw4hQAAAA?pid=Api&P=0&h=180"
        );
        setSession(response.data.total_sessions);
        setTotalStudents(response.data.total_students);
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };
    fetchData();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.get("https://mentor-connect-api.onrender.com/logout", { withCredentials: true });
      navigate("/", { state: { loggedOut: true }, replace: true });
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-23 lg:w-64 bg-blue-900 text-white flex flex-col justify-between">
        <div className="mt-5 flex flex-col items-center lg:items-start">
          <h1 className="hidden lg:block text-3xl font-bold px-4">Mentor Connect</h1>
          <div className="mt-5">
            <button
              className="bg-blue-700 text-white h-10 px-4 rounded-xl cursor-pointer hover:bg-red-800"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>

          <nav className="mt-8 w-full flex flex-col space-y-2">
            <button
              className={`w-full px-4 py-2 text-left hover:bg-blue-700 ${
                activeTab === "overview" ? "bg-blue-800" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`w-full px-4 py-2 text-left hover:bg-blue-700 ${
                activeTab === "profile" ? "bg-blue-800" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </nav>
        </div>

        <button
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <h2 className="text-3xl font-semibold text-black">Teacher Dashboard</h2>
              <p className="text-lg text-gray-600">
                Welcome, <span className="font-medium text-black">{name}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <img
                src={image}
                alt="Profile"
                className="w-22 h-22 rounded-full object-cover border-2 border-black shadow-md"
              />
              <div className="flex flex-col">
                <p className="text-xl font-semibold text-gray-900">{name}</p>
                <p className="text-lg text-gray-600">{email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            <div className="text-black text-xl flex gap-6 bg-white rounded-xl shadow-md p-8 justify-evenly border-t-2 border-gray-300">
              <div className="pr-6 border-r-2 border-gray-300 font-semibold text-gray-700 ">
                👥 Total Students Registered = {totalStudents}
              </div>
              <div className="pr-6 border-r-2 border-gray-300 font-semibold text-gray-700">
                ⭐ Total Ratings = 4.5/5
              </div>
              <div className="pr-6 font-semibold text-gray-700">
                📅 Upcoming Meetings = {eventsData.name?.length || 0}
              </div>
            </div>

            <div className="text-white h-screen p-6 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                {eventsData.location?.map((_, index) => (
                  <div
                    className="bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 space-y-4 hover:border-blue-500 transition duration-300"
                    key={index}
                  >
                    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                      <h2 className="text-lg font-semibold text-blue-400 mb-1">
                        📌 Event Name
                      </h2>
                      <p className="text-gray-300">{eventsData.name?.[index]}</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                      <h2 className="text-lg font-semibold text-green-400 mb-1">
                        🔗 Location
                      </h2>
                      <p className="text-gray-300">{eventsData.location?.[index]}</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                      <h2 className="text-lg font-semibold text-pink-400 mb-1">👤 Guest</h2>
                      <p className="text-gray-300">
                        {eventsData.eventguest?.[index]?.map((i) => i)}
                      </p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                      <h2 className="text-lg font-semibold text-yellow-400 mb-1">🕒 Start Time</h2>
                      <p className="text-gray-300">
                        {new Date(eventsData.starttime?.[index]).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-96 text-center">
              <img
                src={image}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
              />
              <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
              <p className="text-gray-600">{email}</p>
              <p className="text-gray-500 mt-2">Sessions Conducted: {session}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
