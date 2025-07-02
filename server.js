const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const session = require("express-session");

const { registerUser, authenticateUser } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: 'chatsecret',
    resave: false,
    saveUninitialized: true
}));

app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if (registerUser(username, password)) {
        req.session.username = username;
        res.redirect("/chat.html");
    } else {
        res.send("Username already exists. <a href='/login.html'>Try again</a>");
    }
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticateUser(username, password)) {
        req.session.username = username;
        res.redirect("/chat.html");
    } else {
        res.send("Invalid credentials. <a href='/login.html'>Try again</a>");
    }
});

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        socket.username = username;
        socket.room = room;
        socket.to(room).emit("chat message", {
            user: "System",
            text: `${username} joined the chat`,
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on("chat message", (msg) => {
        io.to(socket.room).emit("chat message", {
            user: socket.username,
            text: msg,
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on("disconnect", () => {
        if (socket.username && socket.room) {
            socket.to(socket.room).emit("chat message", {
                user: "System",
                text: `${socket.username} left the chat`,
                time: new Date().toLocaleTimeString()
            });
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
