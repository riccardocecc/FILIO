import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import axios from 'axios'
import BooksList from '../BooksList.jsx/BooksList'
function Main() {

    const {onSent, recentPrompt, showResult, loading, resultData,setInput, input,bookSuggestion,questionsCount} = useContext(Context)

    console.log("Books",bookSuggestion)

  return (
    <div className='main'>
      <div className="nav">
        <p>Folio</p>
        <img src={assets.user_icon} alt="" srcset="" />
      </div>
      <div className="main-container">
        {!showResult
        ?<>
        <div className="greet">
            <p><span>Hello, Reader.</span></p>
            <p>How can i help you today?</p>
        </div>
       
        </>:
        <div className='result'>
            <div className="result-title">
                <img className="icon-chat" src={assets.user_icon} alt="" srcset="" />
                <p>{recentPrompt}</p>
            </div>
            <div className='result-data'>
                <img className="icon-chat" src={assets.gemini_icon} alt="" />
                {loading?
                <div className='loader'>
                    <hr />
                    <hr />
                    <hr />
                </div>
                
                :<div className='result'>
                    <p>{questionsCount}/2</p>
                    <p >{resultData}</p>
                 </div>}
                {bookSuggestion!=null?
                    <BooksList books={bookSuggestion} />
                    :null
                }
            </div>
        </div>
        }
        <div className="main-bottom">
            <div className="search-box">
                <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='write a message' />
                <div>
                    <img onClick={()=>onSent()}  src={assets.send_icon} alt="" />
                </div>
            </div>
            <p className="bottom-info">
            Discover the perfect book for every mood and preference! Folio offers personalized reading suggestions tailored to your emotions and requests, providing you with a unique reading experience.
            </p>
        </div>
      </div>
    </div>
  )
}

export default Main
