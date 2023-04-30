const socket = io('https://emee-chat.hf.space');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const userRef = (username, author) => {
  if (username === author) return "You";
  return author;
};

let name = "";
while(name.length < 3) {
  name = prompt('What is your name? (min: 3 caracters)');
}

const username = name;
appendMessage({ text: `You joined`, theme: "warn-msg-theme" });
socket.emit('new-user', username);

socket.on('chat-context', data => {
  for (let msg of data.chat) {
    if (msg.isWarn) {
      appendMessage({
        text: msg.message,
        theme: "warn-msg-theme"
      });
    } else {
      let author = userRef(username, msg.name);
      let isYou = author === "You" && msg.name != "You";
      let msgTheme = isYou ? "self-msg-theme" : "other-msg-theme";
      appendMessage({
        text: `${author}: ${msg.message}`,
        theme: msgTheme
      });
    }
  }
});

socket.on('chat-message', data => {
  appendMessage({ text: `${userRef(username, data.name)}: ${data.message}` });
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
  window.scroll(0, document.body.scrollHeight);
}
