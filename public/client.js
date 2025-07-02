const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit("chat message", input.value);
        input.value = "";
    }
});

socket.on("chat message", function (data) {
    const item = document.createElement("li");
    item.innerHTML = `<span class="icon">💬</span> <strong>${data.user}</strong> [${data.time}]: ${data.text}`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});
