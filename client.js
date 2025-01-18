var WebSocket = require('ws').WebSocket;
require('dotenv').config(); 

if (process.argv.length < 3) {
    console.error('Expected username argument!');
    process.exit(1);
}

let username = process.argv[2];

console.log(`Connecting to ${process.env.nodeKafkaProducerHost}`)
const ws = new WebSocket(`ws://${process.env.nodeKafkaProducerHost}:${process.env.nodeKafkaConsumerPort}`);

ws.on('error', console.error);

ws.on('open', function open() {

    let info = {
        action: "register",
        userID: username,
        payload: {}
    };
    console.log("Registering client")
    console.log(info)
    ws.send(JSON.stringify(info))
});

ws.on("message", function(data){
    console.log('received from server: %s', data);

    try
    {

    }
    catch(e)
    {
        //console.log(e)
    }

})