import { Database } from 'sqlite3';

const db = new Database('db.sqlite');
db.run(`
    CREATE TABLE IF NOT EXISTS Messages (
        messageID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(16) NOT NULL,
        message TEXT NOT NULL,
        sessionId VARCHAR(36) NOT NULL
    );`
);

let getValues = async(command:string)=>{
    return new Promise(async (resolve, reject) => {
        db.all(command,(error, data:any)=>{
            if (error) reject(error)
            resolve(data)
        })
    })
}

let getMessages = async()=>
    await getValues(`SELECT * from Messages ORDER BY messageID DESC LIMIT 50`)


let getMessageInRange =async (start:number,end:number) =>
    await getValues(`SELECT * from Messages WHERE messageID>=${start} AND messageID<=${end}`)


let createMessage =async (username:string, message:string, sessionId:string) => {
    db.run(`
    INSERT INTO Messages (username, message, sessionId)
    VALUES("${username}","${message}","${sessionId}")
    `)
}
export { getMessageInRange, getMessages, createMessage }