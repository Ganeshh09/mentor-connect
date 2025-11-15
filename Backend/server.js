import express from "express";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import axios from "axios";

dotenv.config();

const PORT = process.env.PORT || 5000;



const app = express();
const jwtpassword = process.env.jwtpassword;
const server = http.createServer(app); 
 

const allowedOrigins = [
  "https://mentor-connect-lake.vercel.app",
  "http://localhost:5173",
  
 // keep this for local testing
];

app.use(cors({
  origin: [
    "https://mentor-connect-lake.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));




// Handle preflight requests globally (important for Render)
app.options("*", cors());
// middlewares

app.use(express.json());

app.use(cookieParser());

// connection of mongoose
const Mongoose_key = process.env.Mongoose_key;
mongoose.connect(Mongoose_key);



// student

// signup as student
const Students = mongoose.model("Students", {
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  profession: {
    type: String,
  },
  degree: {
    type: String,
  },
  passingYear: Number,
  skills_arr: {
    type: Array,
  },
});





app.post("/sign-up-student", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const profession = req.body.profession;
  const degree = req.body.degree;
  const passingYear = req.body.passingYear;
  const skills_arr = req.body.skills_arr;

  const newMember = new Students({
    name,
    email,
    password,
    profession,
    degree,
    passingYear,
    skills_arr,
  });

  await newMember.save();
  res.send("done");
});
// login route (student)
async function check_account_student(email, password) {
  const user = await Students.findOne({ email });
  if (user) {
    if (user && user.password == password) {
      return true;
    }
    return false;
  } else {
    return false;
  }
}
app.post("/student-login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
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

// teacher

// signup as teacher

const Teachers = mongoose.model("Teachers", {
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  profession: {
    type: String,
  },
  degree: {
    type: String,
  },
  passingYear: Number,
  experience: {
    type: String,
  },
  experties: {
    type: String,
  },
});
app.post("/sign-up-teacher", async (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const email = req.body.email;
  const password = req.body.password;
  const profession = req.body.profession;
  const degree = req.body.degree;
  const passingYear = req.body.passingYear;
  const experience = req.body.experience;
  const experties = req.body.experties;

  const newMember = new Teachers({
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

  await newMember.save();
  res.send("done");
});

// login route (teacher)

async function check_account_teacher(email, password) {
  const user = await Teachers.findOne({ email: email });
  if (user && user.password === password) {
    return true;
  }
  return false;
}
app.post("/teacher-login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const isAuthenticated = await check_account_teacher(email, password);
  if (isAuthenticated) {
    const email_token = jwt.sign({ email }, jwtpassword);
    res.cookie("teacher_token", email_token, {
      maxAge: 1450 * 1000 * 60,
      sameSite: "None",
      secure: true,
    });
    res.send(true);
  } else {
    res.send(false);
  }
});

// chatbot
// yaha pr ai aa raha hai
const aiMessage = mongoose.model("AiMessages", {
  email: String,
  prompt: String,
  airesponse: String,
});

const io = new Server(server, {
  cors: {
    origin: [
      "https://mentor-connect-lake.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"]
});

// SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinroom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("message", async ({ roomId, text, sender }) => {
    const newMessage = new MernMessage({
      roomId,
      text,
      sender,
    });

    await newMessage.save();

    io.to(roomId).emit("newmessage", {
      roomId,
      text,
      sender,
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


// server.js (Corrected generateResponse function)


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use Gemini model directly, NOT generateResponse()
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(message);

    const botReply = result.response.text();

    return res.json({ reply: botReply });

  } catch (error) {
    console.error("Chatbot Route Error:", error);
    return res.status(500).json({ error: error.message });
  }
};



app.post("/chat-bot", chatBot);

// // ✅ /chat-bot route
// app.post("/chat-bot", async (req, res) => {
//   try {
//     const { query } = req.body;
//     const token = req.cookies.user_token;

//     if (!token) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     const decoded = jwt.verify(token, jwtpassword);
//     const decoded_email = decoded.email;

//     const aiText = await generateResponse(query);

//     const newChat = new aiMessage({
//       email: decoded_email,
//       prompt: query,
//       airesponse: aiText,
//     });
//     await newChat.save();

//     res.json({ response: aiText });
//   } catch (error) {
//     console.error("Chatbot Route Error:", error.message);
//     res.status(500).json({
//       error: "Internal server error",
//       details: error.message,
//     });
//   }
// });


// chatbot review

app.get("/review", async (req, res) => {
  const token = req.cookies.user_token;
  if (token) {
    const decode_token = jwt.decode(token);
    const decoded_email = decode_token.email;
    const user = await Students.findOne({ email: decoded_email });
    res.send(user);
  } else {
    res.send("error , login as student first , Wait ....are you impostor ?");
  }
});


// mentor search
app.get("/mentors", async (req, res) => {
  const mentorsList = await Teachers.find();
  res.json(mentorsList);
});

app.get("/get-skills", async (req, res) => {
  const token = req.cookies.user_token;
  if (token) {
    const decoded_token = jwt.decode(token);
    const decoded_email = decoded_token.email;
    const user = await Students.findOne({ email: decoded_email });
    res.send(user);
  } else {
    res.send("error , login first");
  }
});
// schedule meet
app.post("/schedule-meet", (req, res) => {
  const email = req.body.email;
  const meeturl = email.substring(0, email.indexOf("@"));
  res.send(`https://calendly.com/${meeturl}/`);
});


const MernMessage = mongoose.model("MernMessage", {
  roomId: String,
  sender: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


app.get("/get-messages/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await MernMessage.find({ roomId });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching room messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get-rooms", async (req, res) => {
  try {
    const rooms = await MernMessage.distinct("roomId");
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/info-for-message", async (req, res) => {
  const email_token = req.cookies.user_token;
  const decoded_email = jwt.decode(email_token).email;
  const username = await Students.findOne({ email: decoded_email });
  if (decoded_email) {
    const name = username.name.split(" ");
    res.send(name[0]);
  }
});

app.post("/validation-for-forum", async (req, res) => {
  const token = req.cookies.user_token;
  const query = req.body.query;
  if (token) {
    const decoded_token = jwt.decode(token);
    const decoded_email = decoded_token.email;
    const user = await Students.findOne({ email: decoded_email });
    if (user && query.trim() != "") {
      res.send(true);
    } else {
      res.send(false);
    }
  } else {
    res.send(false);
  }
});




// logout
 app.get("/logout", (req, res) => {
   res.clearCookie("user_token", { sameSite: "None", secure: true });
   res.clearCookie("teacher_token", { sameSite: "None", secure: true });
   res.send({ message: "Logged out successfully" });
 });
// teachers dashboard
app.get("/get-info", async (req, res) => {
  const token = req.cookies.teacher_token;
  const decoded_email = jwt.decode(token);
  const user = await Teachers.findOne({ email: decoded_email });
  const Students_in_db = (await Students.find()).length;
  const information = {
    total_students: 0,
    name: "",
    email: "",
    total_sessions: 8,
    image_link: "",
  };
  information.total_students = Students_in_db;
  information.name = user.name;
  information.image_link = user.image;
  information.email = user.email;
  res.send(information);
});

app.post("/get-upcoming-events", async (req, res) => {
  const tokens = req.body.token;
  const ownerlink = req.body.ownerlink;
  const response = await axios.get(
    "https://api.calendly.com/scheduled_events",
    {
      headers: {
        Authorization: `Bearer ${tokens}`,
      },
      params: {
        user: ownerlink,
        sort: "start_time:asc",
        status: "active",
      },
    }
  );
  const events = response.data.collection;
  console.log(events);
  res.send(events);
});

app.post("/get-invitee-name", async (req, res) => {
  const all_uri = req.body.uri_id;
  const token = req.body.token;
  if (all_uri) {
    const inviteeNames = await Promise.all(
      all_uri.map(async (i) => {
        const splitting = i.split("/").reverse()[0];
        const response = await axios.get(
          `https://api.calendly.com/scheduled_events/${splitting}/invitees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.collection;
      })
    );
    res.send(inviteeNames);
  }
});

app.post("/check-cookie", (req, res) => {
  const teacher_cookie = req.cookies.teacher_token;
  const student_cookie = req.cookies.user_token;
  teacher_cookie || student_cookie ? res.send(true) : res.send(false);
});

app.get("/check-student-cookie", (req, res) => {
  const user_token = req.cookies.user_token;
  res.json({ isStudent: !!user_token });
});

app.get("/check-teacher-cookie", (req, res) => {
  const teacher_token = req.cookies.teacher_token;
  res.json({ isTeacher: !!teacher_token });
});



app.post("/get-data_OAuth", async (req, res) => {
  const code = req.body.code;
  const client_id = process.env.client_id;
  const client_secret = process.env.client_secret;
  const redirect_uri = "https://mentor-connect-lake.vercel.app/get-data_OAuth";

  try {
    const formdata = new URLSearchParams();
    formdata.append("code", code);
    formdata.append("client_id", client_id);
    formdata.append("client_secret", client_secret);
    formdata.append("redirect_uri", redirect_uri);
    formdata.append("grant_type", "authorization_code");
    const response = await axios.post(
      "https://auth.calendly.com/oauth/token",
      formdata,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Token exchange successful:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Token exchange failed:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: error.response?.data || "Unknown error" });
  }
});


server.listen(PORT, () => {
  console.log(`server connected successfully on ${PORT}`);
});
