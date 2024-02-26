var WebSocket = require('ws').WebSocket;

if (process.argv.length < 3) {
    console.error('Expected username argument!');
    process.exit(1);
}

let username = process.argv[2];

const ws = new WebSocket('ws://localhost:6666');

ws.on('error', console.error);

ws.on('open', function open() {
});

ws.on("message", function(data){
    console.log('received from server: %s', data);

    try
    {
        let o = JSON.parse(data);
        if(o.type == "command" && o.parameter == "register")
        {
            let info = {
                action: "register",
                userID: username,
                payload: {}
            };
            ws.send(JSON.stringify(info))
        }
    }
    catch(e)
    {
        //console.log(e)
    }

})