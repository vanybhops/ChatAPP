import React, { useEffect, useRef, useState } from "react"
import upitnik from "../assets/upitnik.svg"
import websocket from "./websocket";

const CreateChat = (props: any) => {
    const { type, text, user } = props;

    if (type !== localStorage.getItem("session")) {
        return (
            <div className="gap-10 bg-slate-600 max-w-xl break-words w-fit px-5 py-2 rounded-xl">
                <span className=" text-cyan-300">{unescape(user)}</span>
                <h2 className="whitespace-pre-line">{unescape(text.trim())}</h2>
            </div>
        )
    }
    return (
        <div className="ml-auto flex text-right flex-col bg-slate-600 max-w-xl break-words w-fit px-5 py-2 rounded-xl">
            <span className="float-right text-cyan-300">{unescape(user)}</span>
            <h2 className="whitespace-pre-line">{unescape(text.trim())}</h2>
        </div>
    )
}
export default function Chat() {
    const [textValue, setTextValue] = useState("")
    const [loadedMessages, setloadedMessages] = useState<any>([])
    const [lastMessage, setLastMessage] = useState(0)
    const cantSeeThis:any = useRef(null)
    const [loadingMessages , setLoadingMessages ] = useState(false)
    useEffect(() => {
        websocket.onmessage = (message) => {
            const messages = JSON.parse(message.data)
            if (messages.event === "Old") {
                setLastMessage(messages.messages.at(-1).messageID)
                setloadedMessages((msg: any) => [...msg, ...messages.messages])
            }
            if (messages.event === "New") {
                setloadedMessages((msg: any) => [...messages.messages, ...msg])
            }
            setTimeout((_:any)=>setLoadingMessages(false),1000)
        }
        return () => websocket.close();
    }, [])

    const handleClick = (e: React.KeyboardEvent | undefined = undefined) => {
        if (textValue === "") return
        if (e?.keyCode == 13 && e?.shiftKey == false || e == undefined) {
            websocket.send(JSON.stringify({
                "event": "send",
                "message": textValue,
                "sessionId": localStorage.getItem("session"),
                "username": localStorage.getItem("username")
            }))
            setTextValue("")
        }
    }
    const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextValue(e.target.value)
    }
    const onScroll = () => {
        if (lastMessage === 1||!cantSeeThis.current || loadingMessages) return         
        const top = cantSeeThis.current.getBoundingClientRect().top;
        const bottom = cantSeeThis.current.getBoundingClientRect().bottom;
        if(top < window.innerHeight && bottom >= 0){
            setLoadingMessages(true)
            websocket.send(JSON.stringify({
                event: "load",
                lastMessage: lastMessage
            }))
        }
    };
    return (
        <nav>
            <div className="w-screen h-screen flex flex-col">
                <div className="flex p-3 h-20 bg-slate-800 border-b-2 border-slate-600"> {/* chat info */}
                    <button onClick={_ => {
                        localStorage.removeItem("session")
                        location.reload()
                    }
                    } className="text-white px-4 h-full rounded-md">
                        logout
                    </button>
                    <h1 className=" text-white flex justify-center items-center w-full">ChatAPP</h1>
                    <div className="ml-auto">
                        <img src={upitnik} />
                    </div>
                </div>

                <div className="ChatBox flex flex-col-reverse text-white p-10 text-xl scroll-m-1 gap-10 overflow-y-scroll" onScroll={onScroll}> {/* messages */}
                    {
                        loadedMessages.map((message: any) => <CreateChat type={message.sessionId} text={message.message} user={message.username} />
                        )
                    }
                    <span ref={cantSeeThis}></span>
                </div>
                <div className="flex border-t-2 pt-2 bg-slate-800 border-slate-600">
                    <div className="flex rounded-lg w-full box-border  text-white bg-slate-600 left-0 bottom-5 right-0 m-5 h-16 px-5 max-h-fit"> {/* chat input */}
                        <textarea className="resize-none p-4 w-full overflow-hidden bg-slate-600" cols={30} rows={1} onKeyUp={handleClick} value={textValue} onChange={e => handleTextInput(e)}></textarea>
                        <button className="text-cyan-300" onClick={() => { handleClick() }}>Send</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}