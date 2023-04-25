import { useEffect, useState } from "react"
import { Chat, Login } from "./container"

export default function App() {
    const session = localStorage.getItem("session")
    const [handleLogin, setHandleLogin] = useState(false)
    const [username, setUsername] = useState("")
    useEffect(() => {
        if (session !== null) {
            setHandleLogin(true)
            const usr = localStorage.getItem("username");
            if(usr!==null)
                setUsername(usr)
        }
    }, [])
    return (
        <>
            {
                handleLogin ?
                    <Chat/>
                    :
                    <Login setHandleLogin={setHandleLogin} setUsername={setUsername} username={username}/>
            }
        </>
    )
}