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

        if(questionsCount <= 1){
            setPrevPrompt(prev=>[...prev,input])
            setQuestionCount(questionsCount + 1);
            try {
                setBookSuggestion([])
                const response = await axios.post('http://localhost:5000/questionDeeper', { input });
                console.log(response);
                setResultQuestion(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setInput("");
            }
        }else{
            setPrevPrompt(prev=>[...prev,input])
            setQuestionCount(questionsCount + 1);
            try {
                const response = await axios.get('http://localhost:5000/bookSuggestion');
                console.log("FRONT", response.data)
                setBookSuggestion(response.data);
                setQuestionCount(0);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setInput("");
            }
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
