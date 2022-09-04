const socket = io('http://localhost:3010');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');


let name = "";
while(name.length < 3) {
  name = prompt('What is your name?');
}

const username = name;
appendMessage({ text: 'You joined', theme: "warn-msg-theme" });
socket.emit('new-user', username);

socket.on('chat-message', data => {
  appendMessage({ text: `${data.name}: ${data.message}` });
});

socket.on('user-connected', name => {
  appendMessage({ text: `${name} connected`, theme: "warn-msg-theme" });
});

socket.on('user-disconnected', name => {
  appendMessage({ text: `${name} disconnected`, theme: "warn-msg-theme" });
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!messageInput.value) return
  const message = messageInput.value;
  appendMessage({ text: `You: ${message}`, theme: "self-msg-theme"});
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMessage({ text, theme="other-msg-theme" }) {
  const messageElement = document.createElement('div');
  if (theme) messageElement.setAttribute("class", theme);
  messageElement.innerText = text;
  messageContainer.append(messageElement);
}
