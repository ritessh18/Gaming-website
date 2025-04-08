const form = document.getElementById('contactForm');
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');

// Load chat history or show initial greeting
window.addEventListener("DOMContentLoaded", () => {
  loadChatHistory();
  if (!localStorage.getItem("chatHistory")) simulateInitialGreeting();
});

// Form submission with validation
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const fields = { name, email, subject, message };

  clearValidation(fields);

  const errorMsg = validateForm(fields);
  if (errorMsg) {
    simulateBotReply("Form Error: " + errorMsg);
    form.reportValidity();
    return;
  }

  const reply = `Thanks ${name.value.trim()}! Your message was sent successfully. I'll reach out soon!`;
  simulateBotReply(reply);
  form.reset();
});

// Validate form inputs
function validateForm({ name, email, subject, message }) {
  if (!name.value.trim()) {
    name.setCustomValidity('Name is required.');
    return 'Name is required.';
  }
  if (!email.value.includes('@')) {
    email.setCustomValidity('Enter a valid email.');
    return 'Enter a valid email.';
  }
  if (!subject.value.trim()) {
    subject.setCustomValidity('Subject is required.');
    return 'Subject is required.';
  }
  if (!message.value.trim()) {
    message.setCustomValidity('Message is required.');
    return 'Message is required.';
  }
  return '';
}

function clearValidation(fields) {
  Object.values(fields).forEach(field => field.setCustomValidity(''));
}

// Chat input enter key handling
userInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// Send user message
function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  const timestamp = getTime();
  appendMessage('user', msg, timestamp);
  saveToHistory('user', msg, timestamp);
  userInput.value = '';

  showTypingIndicator();

  const reply = generateBotReply(msg);
  const delay = 600 + reply.length * 20;

  setTimeout(() => {
    removeTypingIndicator();
    const botTime = getTime();
    appendMessage('bot', reply, botTime);
    saveToHistory('bot', reply, botTime);
  }, delay);
}

// Generate bot response
function generateBotReply(input) {
  const msg = input.toLowerCase();
  if (/^(hi|hello|hey|yo)\b/.test(msg)) return "Hey there! 👋 How can I assist you?";
  if (msg.includes("help")) return "Sure! Need help with contacting, collaborating, or something else?";
  if (msg.includes("collab") || msg.includes("sponsor")) return "Awesome! You can use the form or drop me your email.";
  if (msg.includes("email")) return "Use the contact form or type your email here and I’ll reach out.";
  if (msg.includes("portfolio") || msg.includes("work")) return "My portfolio is full of cool stuff. Want a link?";
  if (msg.includes("bye")) return "Catch you later! Thanks for visiting!";
  return "Thanks for your message! I'll get back to you shortly.";
}

// Append message to chat UI
function appendMessage(sender, text, time) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-msg`;

  const textDiv = document.createElement('div');
  textDiv.className = 'text';
  textDiv.innerHTML = sender === 'bot' ? `<strong>Bot:</strong> ${text}` : text;

  const timeDiv = document.createElement('span');
  timeDiv.className = 'timestamp';
  timeDiv.textContent = time;

  textDiv.appendChild(timeDiv);
  msgDiv.appendChild(textDiv);
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Get current time string
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simulate initial greeting
function simulateInitialGreeting() {
  const time = getTime();
  const welcome = "Hi there! Looking to collaborate or reach out? I’m here to chat or just fill out the form!";
  appendMessage('bot', welcome, time);
  saveToHistory('bot', welcome, time);
}

// Simulate delayed bot reply
function simulateBotReply(msg) {
  const time = getTime();
  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    appendMessage('bot', msg, time);
    saveToHistory('bot', msg, time);
  }, 1300);
}

// Typing animation
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-msg';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="text typing">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  chatbox.appendChild(typingDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

// Save/load chat history
function saveToHistory(sender, text, time) {
  const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.push({ sender, text, time });
  localStorage.setItem('chatHistory', JSON.stringify(history));
}

function loadChatHistory() {
  const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.forEach(({ sender, text, time }) => {
    appendMessage(sender, text, time);
  });
}

// Clear chat manually
function clearChat() {
  localStorage.removeItem('chatHistory');
  chatbox.innerHTML = '';
  simulateInitialGreeting();
}
