import ws from "ws"
import { getMessages, getMessageInRange, createMessage } from "."
export default async function eventManager(socket:ws.Server, data:any){
    switch (data.event) {
        case "init":
            const poruke = await getMessages()
            return JSON.stringify(poruke)
        case "send":
            createMessage(data.username, data.message, data.sessionId)
            socket.clients.forEach(sock=>{
                sock.send(JSON.stringify([{
                    username:data.username,
                    message:data.message,
                    sessionId:data.sessionId
                }]))
            })
        case "load":
            
            break
        default:
            break
        }
    return ""
}