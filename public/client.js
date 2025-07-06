const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chatMessage", { username, text: input.value });
    input.value = "";
  }
});

socket.on("message", function(msg) {
  const item = document.createElement("li");
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  item.innerHTML = `<span class="timestamp">[${timestamp}]</span> <span class="chat-msg">${msg}</span>`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
