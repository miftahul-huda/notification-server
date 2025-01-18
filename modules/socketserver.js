const WebSocket = require('ws');
const randomstring = require("randomstring")
require('dotenv').config(); 


class SocketServer 
{
    constructor()
    {
        let me = this;
        //this.database = new Database();
        //console.log(process.env.nodeKafkaConsumerPort)
        this.wss = new WebSocket.Server({ port: process.env.nodeKafkaConsumerPort });
        this.sockets = [];

        //console.log("Database for clients is created")
        console.log(`Socket server started on ${process.env.nodeKafkaConsumerPort}` )
    }

    start()
    {
        let me = this;
        this.wss.on('connection', (ws) => {

            ws.on('error', console.error);
        
            ws.on('message', (data) => {
                console.log('received:', data);
                try {
                    const message = JSON.parse(data);
                    if (message.action === 'register') {
                        const sessionID = randomstring.generate(12);
                        const address = ws._socket.remoteAddress;
                        const newClient = { socket: address, clientID: message.userID, session: sessionID, info: message.payload };
                        console.log("Registering new client")
                        console.log(newClient)
                        //me.database.addClient(newClient)
                        ws.clientID = message.userID;
                        me.sockets.push(ws);
                        ws.send(JSON.stringify( { type: "message", message: "Client has been registered." }))
                    }   
                } catch (e) {
                    ws.send('Unknown message format');
                }
            });
        
            ws.on('close', () => {
                // Remove disconnected client from the list
                //me.database.removeClient(ws)
                console.log(`Client ${ws.clientID} has been disconnected`)
                this.sockets = this.sockets.filter((socket) => socket.clientID !== ws.clientID);
            });
        
            // Send initial registration message (optional)
            //ws.send(JSON.stringify({ type: 'command', parameter: 'register' })); // Moved to 'register' handling
        });
    }

    sendNotificationToClient(clientID, message)
    {
        let exist = false;
        this.sockets.map((socket)=>{
            if(socket.clientID === clientID)
            {
                socket.send(JSON.stringify({ type: "notification", message: message }))
                exist = true;
            }
        })

        return exist;
    }
}

module.exports = SocketServer;