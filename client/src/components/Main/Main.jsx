import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import axios from 'axios'
import BooksList from '../BooksList.jsx/BooksList'
function Main() {

    const {onSent, recentPrompt, showResult, loading, resultData,setInput, input,bookSuggestion,questionsCount} = useContext(Context)


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
        {/*<p><span>Hello, Reader.</span></p> */}
            <p>What you would like to read about ?</p>
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
                  <BooksList books={bookSuggestion} />
                 </div>}
                
            </div>
        </div>
        }
        <div className="main-bottom">
            <div className="search-box">
                <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter prompt here' />
                <div>
                    <img onClick={()=>onSent()}  src={assets.send_icon} alt="" />
                </div>
            </div>
            <p className="bottom-info">
            Scopri il libro ideale per ogni tuo stato d'animo e preferenza! Folio ti suggerisce letture personalizzate in base al tuo mood e alle tue richieste, per un'esperienza di lettura unica.
            </p>
        </div>
      </div>
    </div>
  )
}

export default Main
