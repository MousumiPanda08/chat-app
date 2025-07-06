const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const { registerUser, authenticateUser } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messageHistory = {}; // { room: [messages] }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: 'chatsecret',
    resave: false,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    res.redirect("/login.html");
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Error logging out");
        }
        res.redirect("/login.html");
    });
});

app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if (registerUser(username, password)) {
        res.redirect("/login.html");
    } else {
        res.status(400).send("Username already exists.");
    }
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticateUser(username, password)) {
        req.session.username = username;
        res.redirect("/chat.html");
    } else {
        res.status(401).send("Invalid username or password.");
    }
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);

    if (!messageHistory[room]) {
      messageHistory[room] = [];
    }

    socket.emit("messageHistory", messageHistory[room]);

    socket.to(room).emit("message", `${username} joined ${room}`);
  });

  socket.on("chatMessage", ({ username, text }) => {
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    rooms.forEach(room => {
      const message = `${username}: ${text}`;
      messageHistory[room].push(message);
      socket.to(room).emit("message", message);
      socket.emit("message", message);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
