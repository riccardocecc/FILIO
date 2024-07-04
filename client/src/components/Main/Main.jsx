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
            <p>Hoq can i help you today?</p>
        </div>
        <div className='cards'>

            <div className="card">
                <p>Suggest beautfiul places to see on an </p>
                <img src={assets.compass_icon} alt="" srcset="" />
            </div>
            <div className="card">
                <p>Suggest beautfiul places to see on an </p>
                <img src={assets.bulb_icon} alt="" srcset="" />
            </div>
            <div className="card">
                <p>Suggest beautfiul places to see on an </p>
                <img src={assets.bulb_icon} alt="" srcset="" />
            </div>
            <div className="card">
                <p>Suggest beautfiul places to see on an </p>
                <img src={assets.bulb_icon} alt="" srcset="" />
            </div>
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
                <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter prompt here' />
                <div>
                    <img onClick={()=>onSent()}  src={assets.send_icon} alt="" />
                </div>
            </div>
            <p className="bottom-info">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus officiis est voluptates fugit velit, incidunt quis rerum illum porro explicabo eos id? Pariatur, animi cumque velit accusantium asperiores quam fugiat.
            </p>
        </div>
      </div>
    </div>
  )
}

export default Main
