import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import axios from "axios";
import multer from "multer";
import path from "path";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const jwtpassword = process.env.JWT_PASSWORD;
const server = http.createServer(app);

// Enable CORS
app.use(
  cors({
    origin: "https://mentor-connect-lake.vercel.app",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "https://mentor-connect-lake.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
const Mongoose_key = process.env.MONGOOSE_KEY;
mongoose.connect(Mongoose_key, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ====================== Student Schema ======================
const Students = mongoose.model("Students", {
  name: String,
  email: String,
  password: String,
  profession: String,
  degree: String,
  passingYear: Number,
  skills_arr: Array,
});

// Sign-up Student
app.post("/sign-up-student", async (req, res) => {
  try {
    const newMember = new Students(req.body);
    await newMember.save();
    res.send("done");
  } catch (error) {
    res.status(500).send({ error: "Error signing up student" });
  }
});

// Student Login
async function check_account_student(email, password) {
  const user = await Students.findOne({ email });
  return user && user.password === password;
}

app.post("/student-login", async (req, res) => {
  const { email, password } = req.body;
  const isAuthenticated = await check_account_student(email, password);

  if (isAuthenticated) {
    const email_token = jwt.sign({ email }, jwtpassword);
    res.cookie("user_token", email_token, {
      maxAge: 1450 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    res.send(true);
  } else {
    res.send(false);
  }
});

// ====================== Teacher Schema ======================
const Teachers = mongoose.model("Teachers", {
  name: String,
  image: String,
  email: String,
  password: String,
  profession: String,
  degree: String,
  passingYear: Number,
  experience: String,
  experties: String,
});

// Sign-up Teacher
app.post("/sign-up-teacher", async (req, res) => {
  try {
    const newTeacher = new Teachers(req.body);
    await newTeacher.save();
    res.send("done");
  } catch (error) {
    res.status(500).send({ error: "Error signing up teacher" });
  }
});

// Teacher Login
async function check_account_teacher(email, password) {
  const user = await Teachers.findOne({ email });
  return user && user.password === password;
}

app.post("/teacher-login", async (req, res) => {
  const { email, password } = req.body;
  const isAuthenticated = await check_account_teacher(email, password);

  if (isAuthenticated) {
    const email_token = jwt.sign(email, jwtpassword);
    res.cookie("teacher_token", email_token, {
      maxAge: 1450 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    res.send(true);
  } else {
    res.send(false);
  }
});

// ====================== AI Chatbot ======================
const AiMessage = mongoose.model("AiMessages", {
  email: String,
  prompt: String,
  airesponse: String,
});

const myAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(query) {
  const model = myAi.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Explain the following text like a friendly mentor teaching a beginner programmer. 
Make the explanation clear, simple, and encouraging.
Keep it clean and readable with line breaks. 
Here is the text to explain: ${query}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return result.response.text();
}

app.post("/chat-bot", async (req, res) => {
  const { query } = req.body;
  const token = req.cookies.user_token;

  if (!token) return res.status(401).send("error");

  const decoded_email = jwt.decode(token).email;
  const result = await generateResponse(query);

  await new AiMessage({ email: decoded_email, prompt: query, airesponse: result }).save();

  res.send(result);
});

// ====================== Review & Skills ======================
app.get("/review", async (req, res) => {
  const token = req.cookies.user_token;
  if (!token) return res.status(401).send("error, login as student first");

  const decoded_email = jwt.decode(token).email;
  const user = await Students.findOne({ email: decoded_email });
  res.send(user);
});

app.get("/get-skills", async (req, res) => {
  const token = req.cookies.user_token;
  if (!token) return res.status(401).send("error, login first");

  const decoded_email = jwt.decode(token).email;
  const user = await Students.findOne({ email: decoded_email });
  res.send(user);
});

// ====================== Mentor Search ======================
app.get("/mentors", async (req, res) => {
  const mentorsList = await Teachers.find();
  res.json(mentorsList);
});

// ====================== Schedule Meet ======================
app.post("/schedule-meet", (req, res) => {
  const { email } = req.body;
  const meeturl = email.substring(0, email.indexOf("@"));
  res.send(`https://calendly.com/${meeturl}/`);
});

// ====================== File Upload ======================
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDFs are allowed!"), false);
};

const upload = multer({ storage, fileFilter });

app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please upload a PDF file!" });
  res.json({ message: "File uploaded successfully!", file: req.file });
});

// ====================== Real-Time Chat ======================
const MernMessage = mongoose.model("MernMessage", {
  roomId: String,
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

io.on("connection", (socket) => {
  socket.on("joinroom", (roomId) => socket.join(roomId));

  socket.on("message", async ({ roomId, text, sender }) => {
    const newMessage = new MernMessage({ roomId, text, sender });
    await newMessage.save();

    io.to(roomId).emit("newmessage", { roomId, text, sender });
  });
});

app.get("/get-messages", async (req, res) => {
  const messages = await MernMessage.find();
  res.send(messages);
});

// ====================== Logout ======================
app.get("/logout", (req, res) => {
  res.clearCookie("user_token", { sameSite: "None", secure: true });
  res.clearCookie("teacher_token", { sameSite: "None", secure: true });
  res.send({ message: "Logged out successfully" });
});

// ====================== Teacher Dashboard ======================
app.get("/get-info", async (req, res) => {
  const token = req.cookies.teacher_token;
  if (!token) return res.status(401).send("Unauthorized");

  const decoded_email = jwt.decode(token);
  const user = await Teachers.findOne({ email: decoded_email });

  const total_students = await Students.countDocuments();

  res.send({
    total_students,
    name: user.name,
    email: user.email,
    total_sessions: 8,
    image_link: user.image,
  });
});

// ====================== Calendly Integration ======================
app.post("/get-upcoming-events", async (req, res) => {
  const { token, ownerlink } = req.body;
  try {
    const response = await axios.get("https://api.calendly.com/scheduled_events", {
      headers: { Authorization: `Bearer ${token}` },
      params: { user: ownerlink, sort: "start_time:asc", status: "active" },
    });
    res.send(response.data.collection);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/get-invitee-name", async (req, res) => {
  const { uri_id, token } = req.body;
  if (!uri_id || !token) return res.status(400).send("Missing parameters");

  try {
    const inviteeNames = await Promise.all(
      uri_id.map(async (i) => {
        const eventId = i.split("/").pop();
        const response = await axios.get(
          `https://api.calendly.com/scheduled_events/${eventId}/invitees`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.collection;
      })
    );
    res.send(inviteeNames);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ====================== OAuth Token Exchange ======================
app.post("/get-data_OAuth", async (req, res) => {
  const { code } = req.body;
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  try {
    const formdata = new URLSearchParams();
    formdata.append("code", code);
    formdata.append("client_id", CLIENT_ID);
    formdata.append("client_secret", CLIENT_SECRET);
    formdata.append("redirect_uri", REDIRECT_URI);
    formdata.append("grant_type", "authorization_code");

    const response = await axios.post("https://auth.calendly.com/oauth/token", formdata, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Token exchange failed:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Unknown error" });
  }
});

// ====================== Server Listen ======================
server.listen(port, () => {
  console.log(`Server running successfully on port ${port}`);
});
