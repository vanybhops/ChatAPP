import { eventManager } from './src'
import { randomUUID } from 'crypto'
import express, { Request } from'express'
import ws from "ws"
import cors from "cors"
import path from 'path'
const app = express()
const port = 3000


const wsServer = new ws.Server({noServer:true})
wsServer.on('connection', async socket => {
    socket.send(await eventManager(wsServer,{"event":"init"}))
    socket.on('message', async message => {
        try {
            let data = JSON.parse(message.toString())
            const response = await eventManager(wsServer,data)
            if(response=="")return
            socket.send(response)
        } catch (error) {
            socket.close()
        }
    });
    
});
app.use(cors())
app.get('/login', (req, res) => {
  res.send({"session":randomUUID()})
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"/assets/index.html"))
  })
app.get('/assets/*', (req:any, res) => {
    res.sendFile(path.join(__dirname,`/assets/${req.params["0"]}`))
  })

const server = app.listen(port)

server.on("upgrade",(request:Request, socket, head)=>{
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
      });
})