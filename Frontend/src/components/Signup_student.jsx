import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup_student() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setprofession] = useState("");
  const [degree, setdegree] = useState("");
  const [passingYear, setpassingYear] = useState("");
  const [skillsArr, setSkillsArr] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation check
    if (
      !name ||
      !email ||
      !password ||
      !profession ||
      !degree ||
      !passingYear
    ) {
      alert("Please fill all the fields before signing up.");
      return;
    }

    try {
      const response = await axios.post("https://mentor-connect-api.onrender.com/sign-up-student", {
        name,
        email,
        password,
        profession,
        degree,
        passingYear,
        skills_arr: skillsArr,
      });

      alert(response.data);

      // ✅ redirect after success
      if (response.data) {
        navigate("/student-login");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Signup failed!");
    }
  };

  // ✅ toggle skill button
  const toggleSkill = (skill) => {
    setSkillsArr((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="flex bg-gray-800 justify-center items-center min-h-screen gap-8 px-6 py-10">
      
      {/* Signup Form */}
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-gray-900 border border-gray-700">
        <h2 className="text-center text-3xl font-bold text-blue-300 mb-2">
          Sign Up (Mentee)
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Join us by filling out the form below
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Full Name"
            onChange={(e) => setname(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Email"
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Profession"
            onChange={(e) => setprofession(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Degree"
            onChange={(e) => setdegree(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="number"
            placeholder="Year of Passing"
            onChange={(e) => setpassingYear(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Skills Section */}
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-gray-900 border border-gray-700">
        <h2 className="text-center text-3xl font-bold text-blue-300 mb-4">
          Setup Skills (Mentee)
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            "Html",
            "Web development",
            "Web3",
            "Ml",
            "DSA",
            "GenAi",
            "Python",
            "C++",
            "MERN",
            "Web Scrapping",
            "Selenium",
          ].map((skill, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 text-sm rounded-lg transition duration-300 ${
                skillsArr.includes(skill)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white hover:bg-blue-500"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
