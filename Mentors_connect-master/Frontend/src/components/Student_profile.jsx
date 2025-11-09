import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Student_profile = () => {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "https://mentor-connect-api.onrender.com/get-skills",
          { withCredentials: true }
        );

        const data = response.data || {};
        setSkills(Array.isArray(data.skills_arr) ? data.skills_arr : []);
        setEmail(data.email || "");
        setProfession(data.profession || "");
        setName(data.name || "");
        setDegree(data.degree || "");
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setSkills([]); // fallback to avoid .length crash
      }
    };
    getData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("https://mentor-connect-api.onrender.com/logout", { withCredentials: true });
      navigate("/", { state: { loggedOut: true }, replace: true });
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  return (
    <div className="bg-[#271F3F] min-h-screen w-screen">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-bold flex items-center">
          <span className="mr-2">🔗</span> Mentor Connect
        </h1>
        <ul className="flex gap-6">
          <li>
            <Link
              to="/"
              className="hover:bg-white hover:text-indigo-700 transition-all px-4 py-2 rounded-lg font-medium"
            >
              Home
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:bg-white hover:text-indigo-700 transition-all px-4 py-2 rounded-lg font-medium"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white rounded-lg border border-gray-300 w-80">
          <div className="rounded-tl-lg rounded-tr-lg flex justify-center p-4 bg-zinc-700">
            <img
              className="w-40 h-40 rounded-full object-cover border-b-3 border-white"
              src="https://static.vecteezy.com/system/resources/previews/007/469/004/non_2x/graduated-student-in-simple-flat-personal-profile-icon-or-symbol-people-concept-illustration-vector.jpg"
              alt="Profile"
            />
          </div>

          <div className="bg-gray-900 text-white p-3 rounded-b-lg">
            <h1 className="text-gray-300 text-center text-3xl mb-2 font-sans">
              {name}
            </h1>
            <h1 className="text-gray-300 text-md mb-[1.5px]">
              Email : {email}
            </h1>
            <h1 className="text-gray-300 text-md mb-[1.5px]">
              Profession : {profession}
            </h1>
            <h1 className="text-gray-300 text-md mb-2">Degree : {degree}</h1>

            <div className="flex flex-wrap gap-2 mt-3">
              {skills?.length > 0 ? (
                skills.map((i, index) => (
                  <div
                    key={index}
                    className="badge badge-outline badge-accent"
                  >
                    {i}
                  </div>
                ))
              ) : (
                <div>No skills data found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student_profile;
