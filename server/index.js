const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const axios = require('axios')
const app = express();
const session = require('express-session');
const uuid = require('uuid');
require('dotenv').config();


const port = process.env.PORT;

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API
});
app.use(cors({
  origin: 'https://filio-client.vercel.app/', // Sostituisci con l'URL del tuo client
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




function get_book_info(book_name, author_name){
    let  bookInfo = {
     book_name:book_name,
     author_name:author_name,
     coverUrl:"null",
         publication: "2018",
         description: "no description yet"
         
     }
     return bookInfo
}


  async function searchBook(title) {
    const apiKey = process.env.GOOGLE_API;  // Sostituisci con la tua API key
    const url = 'https://www.googleapis.com/books/v1/volumes';
    const query = title;

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
            
            if (titleMatch && hasThumbnail && hasDescription && hasEnglish) {
                const publishedDate = new Date(info.publishedDate);
                if (!latestPublishedDate || publishedDate > latestPublishedDate) {
                    latestPublishedDate = publishedDate;
                   
                    foundBook = {
                        thumbnail: info.imageLinks.thumbnail,
                        description: info.description
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



app.post("/questionDeeper", async (req, res) => {
    
    try {
        const userPrompt = req.body.input;
        const chatHistory = req.session.chat;
        const messages = chatHistory.map(([role, content]) => ({
            role,
            content,
        }));
        messages.push({
            role: 'system',
            content: `Sulla base di questo "${userPrompt}", fai UNA sola domanda specfica per capire effettivamente quale libro vuole leggere, ma non dare il libro ancora`,
        });
        const questionCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages,
            max_tokens:100
          });
        
        const followUpQuestion = questionCompletion.choices[0].message.content.trim();
        chatHistory.push(['user', userPrompt]);
        chatHistory.push(['assistant', followUpQuestion]);
        req.session.chat = chatHistory;
        
        res.json(followUpQuestion); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore del server: ' + error.message);
    }
});

async function queryFormulation(req){
  
  const chatHistory = req.session.chat;
    const finalMessages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      finalMessages.push({
        role: 'system',
        content: `Esamina attentamente la conversazione tra il sistema e l'utente per identificare le preferenze di lettura dell'utente. In base a queste preferenze, genera una frase concisa e diretta che l'utente può usare per richiedere il libro ideale.Sii diretto`,
      });

      const questionCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: finalMessages,
        temperature: 0.2
      });
    req.session.chat = [];

    return questionCompletion.choices[0].message.content.trim();
}
app.get("/", (req, res) => {
  res.send("Welcome to folio");
});




app.get("/bookSuggestion", async (req, res) => {
    
    try {
      
      const query = await queryFormulation(req)
         
          const message=[{
            role:'system',
            content:` ${query} consigliami 3 libri che si trovano su Amazon dando solo il nome e l'auotre`
          }]
        
          const tools = [
            {
              type: "function",
              function: {
                name: "get_book_info",
                description: "Get book information about the book",
                parameters: {
                  type: "object",
                  properties: {
                    book_name: {
                      type: "string",
                      description: "The name of the book, e.g. 'Moby Dick' ",
                    },
                    author_name: {
                        type: "string",
                        description: "The name of the author, e.g. 'Herman Melville'",
                    },
                  },
                  required: ["book_name","author_name"],
                },
              },
            },
          ];
          // Call the API for the final recommendation
          const recommendationCompletion = await openai.chat.completions.create({
            //model: 'gpt-3.5-turbo-0125',
            model:'gpt-3.5-turbo-0125',
            messages: message,
            temperature:0,
            tools:tools,
            tool_choice:"auto"
          });
          
          const toolCalls = recommendationCompletion.choices[0].message.tool_calls;
          const bookInfoPromises = toolCalls.map(async (toolCall) => {
            if (toolCall.type === 'function' && toolCall.function.name === 'get_book_info') {
                const args = JSON.parse(toolCall.function.arguments);
                //const bookDetails = await searchBook(args.book_name);
                return get_book_info(args.book_name, args.author_name);
            }
        });

        const books = await Promise.all(bookInfoPromises);

        res.json(books);
        

    } catch (error) {
        console.error(error);
        res.status(500).send('Errore del server: ' + error.message);
    }
});




app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});

