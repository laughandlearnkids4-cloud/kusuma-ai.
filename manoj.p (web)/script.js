const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const historyList = document.getElementById("historyList");

let conversations = JSON.parse(localStorage.getItem("conversations")) || [];
let currentChat = [];

// Load sidebar
renderSidebar();

function renderSidebar() {
  historyList.innerHTML = "";
  conversations.forEach((conv, index) => {
    const li = document.createElement("li");
    li.innerText = conv[0]?.text || "Conversation";
    li.onclick = () => loadConversation(index);
    historyList.appendChild(li);
  });
}

function loadConversation(index) {
  chatBox.innerHTML = "";
  currentChat = conversations[index];
  currentChat.forEach(m => addMessage(m.text, m.sender, false));
}

function addMessage(text, sender, save = true) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (save) {
    currentChat.push({ text, sender });
  }

  if (sender === "bot") speak(text);
}

function sendMessage(textFromVoice = null) {
  const text = textFromVoice || input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    const reply = aiCalculate(text.toLowerCase());
    addMessage(reply, "bot");
    saveConversation();
  }, 300);
}

function saveConversation() {
  if (!conversations.includes(currentChat)) {
    conversations.push(currentChat);
  }
  localStorage.setItem("conversations", JSON.stringify(conversations));
  renderSidebar();
}

// 🧮 AI logic
function aiCalculate(text) {
  try {
    text = text
      .replace("plus", "+")
      .replace("minus", "-")
      .replace("times", "*")
      .replace("multiply", "*")
      .replace("divide", "/")
      .replace("by", "")
      .replace("power", "**");

    return eval(text).toString();
  } catch {
    return "Sorry, I couldn't understand that.";
  }
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";

document.getElementById("micBtn").onclick = () => {
  recognition.start();
};

recognition.onresult = (e) => {
  sendMessage(e.results[0][0].transcript);
};


function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  speechSynthesis.cancel(); // stop previous
  speechSynthesis.speak(utterance);
}

