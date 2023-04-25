import React, { useEffect, useState } from "react"
import upitnik from "../assets/upitnik.svg"
import websocket from "./websocket";

const CreateChat=(props:any)=>{
    const {type, text, user} = props;

    if (type!==localStorage.getItem("session")) {
        return(
            <div className="gap-10 bg-slate-600 max-w-xl break-words w-fit px-5 py-2 rounded-xl">
                <span className=" text-cyan-300">{unescape(user)}</span>
                <h2 className="whitespace-pre-line">{unescape(text.trim())}</h2>
            </div>
        )
    }
    return(
        <div className="ml-auto flex text-right flex-col bg-slate-600 max-w-xl break-words w-fit px-5 py-2 rounded-xl">
            <span className="float-right text-cyan-300">{unescape(user)}</span>
            <h2 className="whitespace-pre-line">{unescape(text.trim())}</h2>
        </div>
    )
}
export default function Chat(){
    const [textValue,setTextValue] = useState("")
    const [lastMessage, setLastMessage] = useState<any>([])
    useEffect(()=>{
        websocket.onmessage = (message)=>{
            const messages = JSON.parse(message.data)
            setLastMessage((msg:any)=>[...messages, ...msg])
        }
        return () => websocket.close();
    },[])

    const handleClick=(e:React.KeyboardEvent|undefined=undefined)=>{
        if(textValue==="") return
        if (e?.keyCode == 13 && e?.shiftKey == false||e==undefined){
            websocket.send(JSON.stringify({
                "event":"send",
                "message":textValue,
                "sessionId":localStorage.getItem("session"), 
                "username": localStorage.getItem("username")
            }))
            setTextValue("")
        }
    }
    const handleTextInput = (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setTextValue(e.target.value)
    }
    return(
        <nav>
            <div className="flex w-screen h-screen">
                <div className="w-full h-full flex flex-col">
                    <div className="flex p-3 h-20 bg-slate-800 border-b-2 border-slate-600"> {/* chat info */}
                    <h1 className=" text-white flex justify-center items-center w-full">ChatAPP</h1>
                        <div className="ml-auto"> 
                            <img src={upitnik}/>
                        </div>
                    </div> 

                    <div className="ChatBox flex flex-col-reverse h-full text-white p-10 text-xl scroll-m-1 gap-10 overflow-y-auto"> {/* messages */}
                    {
                        lastMessage.map((message:any)=><CreateChat type={message.sessionId} text={message.message} user={message.username}/>
                        )
                    }
                    </div>
                    <div className="flex">
                        <button onClick={_=>{
                                localStorage.removeItem("session")
                                location.reload()} 
                                } className="text-white px-5 mt-0 mb-5 ml-5 bg-slate-600 rounded-md"> 
                                logout 
                            </button>
                        <div className="flex rounded-lg w-full box-border text-white bg-slate-600 left-0 bottom-5 right-0 mt-0 mb-5 ml-1 mr-5 h-16 px-5 max-h-fit"> {/* chat input */}
                            <textarea className="resize-none p-4 w-full overflow-hidden bg-slate-600" cols={30} rows={1} onKeyUp={handleClick} value={textValue} onChange={e=>handleTextInput(e)}></textarea>
                            <button className="text-cyan-300" onClick={()=>{handleClick()}}>Send</button>
                        </div> 
                    </div>
                </div>
            </div>
        </nav>
    )
}