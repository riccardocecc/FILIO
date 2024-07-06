import { createContext, useState } from "react";
import axios from 'axios';

export const Context = createContext();

const ContextProvider = (props) => {

    const[input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);

    const [loading, setLoading] = useState(false);
    const [resultQuestion, setResultQuestion] = useState("");
    const [questionsCount, setQuestionCount] = useState(0);
    const [bookSuggestion, setBookSuggestion] = useState([]);

    const newChat = () =>{
        setLoading(false);
        setShowResult(false);

    }

    const onSent = async(prompt)=>{
        setResultQuestion("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)

       
            setPrevPrompt(prev => [...prev, input]);
            try {
                setBookSuggestion([]);
                //const response = await axios.post('https://filio-server.vercel.app/questionDeeper', { input });
                let response = null;
                
                 response = await axios.post('https://filio-server.vercel.app/questionDeeper', { input },{ withCredentials: true });
                
                 setQuestionCount(questionsCount + 1);
                if(questionsCount===2){
                    response = await axios.get('https://filio-server.vercel.app/bookSuggestion',{ withCredentials: true });
                    setBookSuggestion(response.data);
                    
                    setQuestionCount(0);
                }else{
                    setResultQuestion(response.data);
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setInput("");
            }
    }

 

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData: resultQuestion,
        input,
        setInput,
        newChat,
        bookSuggestion,
        questionsCount
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
