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
socket.emit('new-user', username);

socket.on('chat-context', data => {
  for (let msg of data.chat) {
    if (msg.isWarn) {
      appendWarn({
        text: msg.message.replace(username, "You")
      });
    } else {
      let author = userRef(username, msg.name);
      let isYou = author === "You" && msg.name != "You";
      appendMessage({
        author: author,
        text: msg.message,
        self: isYou
      });
    }
  }
  appendWarn({ text: `You joined` });
});

socket.on('chat-message', data => {
  appendMessage({ text: `${userRef(username, data.name)}: ${data.message}` });
});

socket.on('user-connected', name => {
  appendWarn({ text: `${name} connected`, theme: "warn-msg-theme" });
});

socket.on('user-disconnected', name => {
  appendWarn({ text: `${name} disconnected`, theme: "warn-msg-theme" });
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!messageInput.value) return
  const message = messageInput.value;
  appendMessage({ author: "You", text: message, self: true });
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendWarn({ text }) {
  const messageElement = document.createElement('div');
  messageElement.setAttribute("class", "warn-msg-theme");
  messageElement.innerText = text;
  messageContainer.append(messageElement);
  window.scroll(0, document.body.scrollHeight);
}

function appendMessage({ author, text, self }) {
  const messageElement = document.createElement('div');
  const msgTheme = self ? "self-msg-theme" : "other-msg-theme";
  messageElement.setAttribute("class", msgTheme);
  messageElement.innerHTML = `<div><strong>${author}</strong>: ${text}</div>`;
  messageContainer.append(messageElement);
  window.scroll(0, document.body.scrollHeight);
}
