const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// Middleware setup for parsing JSON request bodies
app.use(express.json());

// Middleware setup for session
app.use(session({
  secret: 'secret-key', // Replace with a random string (used for session encryption)
  resave: false,
  saveUninitialized: true
}));

// Middleware to initialize req.session.chat if not already defined
app.use((req, res, next) => {
  if (!req.session.chat) {
    req.session.chat = [];
  }
  next();
});

// Route to handle POST requests to /chat endpoint
app.post("/chat", (req, res) => {
  const { input } = req.body; // Assuming { "input": "Hello from Postman!" }

  // Add the new message to the chat array in the session
  const chatHistory = req.session.chat;

chatHistory.push(['user', input]);
chatHistory.push(['assistant', "e dale"]);
  
  req.session.chat = chatHistory

  res.status(200).send("Message added to chat");
});
function getInfo(req){
     const edale = req.session.chat
     req.session.chat = [];
     return edale;
}
// Route to retrieve chat messages from the session
app.get("/chat", async (req, res) => {
  // Return the chat array from the session
  const message = getInfo(req);
  res.json(message);
});

app.get("/final", (req, res) => {
    // Return the chat array from the session
    
    res.json(req.session.chat);
  });

// Route to handle GET requests to the root URL
app.get("/", (req, res) => {
  res.send("Welcome to folio");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
