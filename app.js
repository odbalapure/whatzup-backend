require("dotenv").config();
require("express-async-errors");

const cors = require("cors");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*"
  }
});

// Db connection
const connectDb = require("./db/connect");

// Routers
const authRouter = require("./routes/auth");
const announcementsRouter = require("./routes/announcements");
const eventsRouter = require("./routes/events");
const messagesRouter = require("./routes/messages");

// Error handlers
const notFoundMiddleware = require("./middleware/not-found");
const Message = require("./models/Message");
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.get("/", (_, res) => {
  res.send(`
      <h1>Whatzup!</h1>
      <div>
        <h3>REST Endpoints</h3>
        <p><b>Auth:</b>/api/v1/auth</p>
        <p><b>Announcements:</b>/api/v1/announcements</p>
        <p><b>Events:</b>/api/v1/events</p>
      </div>
    `);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/announcements", announcementsRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/messages", messagesRouter);
app.use(notFoundMiddleware);

/* ============================================================= */

let messages = [];
const port = process.env.PORT || 5000;

/* Handle connections and messages */
io.on("connection", (socket) => {
  /* User connected */
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id ${socket.id} joined room ${data}`);
    if (messages?.length > 0) {
      Message.insertMany(messages).then((data) => {
        if (data) {
          console.log("data", data);
          messages = [];
        }
      });
    }
  });

  /* Inform client about new messages */
  socket.on("send_msg", (data) => {
    messages.push(data);
    // Mention the room to which msg needs to sent
    socket.to(data.eventId).emit("recieve_msg", data);
  });

  /* User disconnected */
  socket.on("disconnect", async () => {
    if (messages?.length > 0) {
      Message.insertMany(messages).then((data) => {
        if (data) {
          messages = [];
        }
      });
    }
  });
});

// Connect to DB
connectDb(process.env.MONGO_URI);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});

/* ============================================================= */
