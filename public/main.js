const usersList = document.getElementById("users");
const board = document.getElementById("board");
const userMessage = document.getElementById("message__text");
const userName = document.getElementById("message__name");
const sendButton = document.getElementById("message__btn");

const socket = io();
const messages = [];
const LIMIT_MESSAGES = 10;

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const render = (body, elements) => {
  body.innerHTML = "";
  const fragment = document.createDocumentFragment();

  elements.forEach((element) => {
    fragment.appendChild(element);
  });

  body.appendChild(fragment);
};

const renderListOfMessages = ({ name, message }) => {
  const divName = document.createElement("div");
  divName.classList.add("display__name");
  divName.textContent = name;

  const divMessage = document.createElement("div");
  divMessage.classList.add("display__message");
  divMessage.textContent = message;

  const divWrapper = document.createElement("div");
  divWrapper.classList.add("chat__display");

  divWrapper.appendChild(divName);
  divWrapper.appendChild(divMessage);

  if (messages.unshift(divWrapper) > LIMIT_MESSAGES) {
    messages.pop();
  }

  render(board, messages);
};

const renderListOfUsers = (data) => {
  const userElement = Object.values(data).map((user) => {
    const li = document.createElement("li");
    li.classList.add("users__item");
    li.textContent = user;
    return li;
  });
  render(usersList, userElement);
};

const pressEnterKey = (e) => {
  if (e.keyCode === 13) {
    sendUserMessage();
  }
};

const sendUserMessage = () => {
  let name = userName.value;
  const message = userMessage.value;

  if (message === "" || name === "") {
    return;
  }

  socket.emit("message", {
    message,
    name,
  });

  userMessage.value = "";
  userMessage.focus();
};

sendButton.addEventListener("click", sendUserMessage);
userMessage.addEventListener("keyup", pressEnterKey);

socket.on("user", renderListOfUsers);
socket.on("message", renderListOfMessages);
