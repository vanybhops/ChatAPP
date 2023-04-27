import ws from "ws"
import { getMessages, getMessageInRange, createMessage } from "."
export default async function eventManager(socket:ws.Server, data:any){
    switch (data.event) {
        case "init":
            const poruke = await getMessages()
            return JSON.stringify({
                event:"Old",
                messages:poruke
            })
        case "send":
            createMessage(data.username, data.message, data.sessionId)
            socket.clients.forEach(sock=>{
                sock.send(JSON.stringify({
                    event:"New",
                    messages:[{
                            username:data.username,
                            message:data.message,
                            sessionId:data.sessionId
                        }]
                    }
                ))
            })
            break
        case "load":
            let messages = await getMessageInRange(data.lastMessage)
            return JSON.stringify({
                event:"Old",
                messages: messages
            }) 
            
        default:
            break
        }
    return ""
}