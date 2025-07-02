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
app.use(express.static("public"));  // Serve static files

// Redirect root to login page
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.use(session({
    secret: 'chatsecret',
    resave: false,
    saveUninitialized: true
}));

app.post("/signup", (req, res) => { /* existing signup code */ });
app.post("/login", (req, res) => { /* existing login code */ });

io.on("connection", (socket) => {
    // existing socket logic...
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
