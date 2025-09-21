import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup_teacher() {
  const [name, setname] = useState("");
  const [image, setimage] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setprofession] = useState("");
  const [degree, setdegree] = useState("");
  const [passingYear, setpassingYear] = useState("");
  const [experience, setexperience] = useState("");
  const [experties, setexperties] = useState("");

  const navigate = useNavigate();

  // function to handle signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (
      !name ||
      !email ||
      !password ||
      !profession ||
      !degree ||
      !passingYear ||
      !experience ||
      !experties
    ) {
      alert("⚠️ Please fill in all required fields!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/sign-up-teacher", {
        name,
        image,
        email,
        password,
        profession,
        degree,
        passingYear,
        experience,
        experties,
      });

      alert(response.data);

      // redirect to teacher login after success
      navigate("/teacher-login");
    } catch (error) {
      console.error("Signup error:", error);
      alert("❌ Something went wrong. Try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700 p-6">
      <div className="w-full max-w-md p-8 rounded-xl shadow-2xl bg-gray-900">
        <h2 className="text-center text-3xl font-bold text-blue-200">
          Sign Up (mentor)
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us by filling out the form below
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setname(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="text"
            placeholder="image.png (optional)"
            onChange={(e) => setimage(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="text"
            placeholder="Profession"
            onChange={(e) => setprofession(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="text"
            placeholder="Degree"
            onChange={(e) => setdegree(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="number"
            placeholder="Year of Passing"
            onChange={(e) => setpassingYear(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="text"
            placeholder="Experience (e.g., 5+ years)"
            onChange={(e) => setexperience(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="text"
            placeholder="Expertise"
            onChange={(e) => setexperties(e.target.value)}
            className="w-full p-4 border rounded-lg bg-gray-900 text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-lg font-bold transition duration-300 shadow-lg"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Signup as
          <Link
            to="/sign-up-student"
            className="text-blue-600 hover:underline font-semibold ml-1"
          >
            mentee
          </Link>
        </p>
      </div>
    </div>
  );
}
