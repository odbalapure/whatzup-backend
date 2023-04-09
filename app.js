require("dotenv").config();
require("express-async-errors");

const cors = require("cors");
const express = require("express");
const app = express();
const redis = require("redis");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*"
  }
});

// Redis client
const client = redis.createClient(6379);
client.on("error", (err) => {
  console.log("REDIS INIT ERROR:", err);
});

const checkCache = (req, res, next) => {
  let search = req.params.search;
  client.get(search, (err, data) => {
    if (err) throw err;
    if (!data) {
      return next();
    } else {
      return res.json({ data: JSON.parse(data), info: "data from cache" });
    }
  });
};

// Db connection
const connectDb = require("./db/connect");

// Routers
const authRouter = require("./routes/auth");
const announcementsRouter = require("./routes/announcements");
const eventsRouter = require("./routes/events");

// Error handlers
const notFoundMiddleware = require("./middleware/not-found");
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
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
app.use("/api/v1/announcements", checkCache, announcementsRouter);
app.use("/api/v1/events", eventsRouter);
app.use(notFoundMiddleware);

/* ============================================================= */

const port = process.env.PORT || 5000;

/* Handle connections and messagesF */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* User connected */
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id ${socket.id} joined room ${data}`);
  });

  /* Inform client about new messages */
  socket.on("send_msg", (data) => {
    console.log(data);
    // Mention the room to which msg needs to sent
    socket.to(data.room).emit("recieve_msg", data);
  });

  /* User disconnected */
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to DB
connectDb(process.env.MONGO_URI);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});

/* ============================================================= */
