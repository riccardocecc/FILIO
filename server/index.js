const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const axios = require('axios')
const app = express();
const session = require('express-session');
const uuid = require('uuid');
const LanguageDetect = require('languagedetect');
require('dotenv').config();
const lngDetector = new LanguageDetect();

const port = process.env.PORT;

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API
});
app.use(cors({
  origin: 'https://filio-client.vercel.app', // Sostituisci con l'URL del tuo client
  //origin:'http://localhost:5173',
  credentials: true
}));


app.use(express.json());

// Middleware setup for session
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Imposta su true in produzione con HTTPS
    httpOnly: true // Solo il server può accedere al cookie
  }
}));

// Middleware to initialize req.session.chat if not already defined
app.use((req, res, next) => {
  if (!req.session.chat) {
    req.session.chat = [];
  }
  next();
});




function get_book_info(book_name, author_name,choice_description, book_cover){
      let  bookInfo = {
          book_name:book_name,
          author_name:author_name,
          coverUrl:book_cover,
          publication: "2018",
          description: choice_description
      }
     return bookInfo
}


  async function searchBook(title) {
    const apiKey = process.env.GOOGLE_API;  // Sostituisci con la tua API key
    const url = 'https://www.googleapis.com/books/v1/volumes';
    //const query = `${title}+inauthor:${author}`
    const query = title
    try {
        const response = await axios.get(url, {
            params: {
                q: query,
                key: apiKey
            }
        });

        const books = response.data.items;
        let foundBook = null;
        let latestPublishedDate = null;

        books.forEach((book) => {
            const info = book.volumeInfo;
            const titleMatch = info.title.toLowerCase().includes(title.toLowerCase());
            const hasThumbnail = info.imageLinks && info.imageLinks.thumbnail;
            const hasDescription = info.description
            const hasEnglish = info.language=== 'en';
            
            if (titleMatch  && hasThumbnail && hasDescription && hasEnglish) {
                const publishedDate = new Date(info.publishedDate);
                if (!latestPublishedDate || publishedDate > latestPublishedDate) {
                    latestPublishedDate = publishedDate;
                    foundBook = {
                        thumbnail: info.imageLinks.thumbnail,
                    };
                }
            }
        });

        if (foundBook) {
            return foundBook;
        } else {
            return 'No book found matching the specified title.';
        }
    } catch (error) {
        console.error('Error fetching data from Google Books API', error);
        return 'Error fetching data from Google Books API';
    }
}






app.get("/", (req, res) => {
  res.send("Welcome to folio");
});


app.post("/bookSuggestion", async (req, res) => {
    
    try {
    
      const userPrompt = req.body.input;
      const chatHistory = req.session.chat;
      const messages = chatHistory.map(([role, content]) => ({
          role,
          content,
      }));
      chatHistory.push(['user', userPrompt]);
      const input = [{
          role: 'system',
          content: `You are an assistant who recommends books to read. Analyzing this sentence "${userPrompt}", recommends THREE books from Amazon. `,
      }];


      console.log(" userPrompt: " + userPrompt + "After push: " + messages);

        
          const tools = [
            {
              type: "function",
              function: {
                name: "get_book_info",
                description: `Get information about the book and why it was chosen.`,
                parameters: {
                  type: "object",
                  properties: {
                    book_name: {
                      type: "string",
                      description: "The name of the book, e.g. 'Interazione del colore' ",
                    },
                    author_name: {
                        type: "string",
                        description: "The name of the author, e.g. 'Josef Albers'",
                    },
                    choice_description: {
                      type: "string",
                      description: "why it was chosen, e.g. 'A classic in the field of art and design, exploring how colors interact with each other and how we perceive these emotions'",
                  }
                  },
                  required: ["book_name","author_name","choice_description"],
                },
              },
            },
          ];
          // Call the API for the final recommendation
          const recommendationCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125',
            messages: input,
            temperature:0,
            tools:tools,
            tool_choice:"auto"
          });
          
          const toolCalls = recommendationCompletion.choices[0].message.tool_calls;
          const bookInfoPromises = toolCalls.map(async (toolCall) => {
            if (toolCall.type === 'function' && toolCall.function.name === 'get_book_info') {
                const args = JSON.parse(toolCall.function.arguments);
                
                const bookDetails = await searchBook(args.book_name);
               
                return get_book_info(args.book_name, args.author_name, args.choice_description, bookDetails.thumbnail);
            }
        });

        const books = await Promise.all(bookInfoPromises);
        req.session.chat = chatHistory;
        res.json(books);
        
        

    } catch (error) {
        console.error(error);
        res.status(500).send('Errore del server: ' + error.message);
    }
});




app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});

