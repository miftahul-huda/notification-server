const SocketServer = require("./modules/socketserver")
const KafkaConsumer = require("./modules/kafkaconsumer")
const Database = require("./modules/database");

//Create database to store client undelivered messages
const database = new Database();

//Create socket server to handle clients
let socketServer = new SocketServer();
socketServer.start();

//Create kafka consumer to consume kafka message
let kafkaConsumer = new KafkaConsumer();
kafkaConsumer.onKafkaMessageArrived = (message, kafkaMessage, opt)=>{
    let success = socketServer.sendNotificationToClient(message.user, message.message)
    if(!success)
    {
        let newClient = { clientID: message.user, message: message.message }
        database.addClient(newClient)
    }
}
kafkaConsumer.run();

setInterval(function(){
    database.getAllClients().then((clients)=>{
        clients.map((client)=>{
            let success = socketServer.sendNotificationToClient(client.clientID, client.message)
            if(success)
            {
                database.removeClient(client.clientID)
            }
        })
    })
}, 5000)



