var WebSocketServer = require('ws').WebSocketServer;
var createServer = require('http').createServer;
var randomstring = require("randomstring");

let wsss = [];

const server = createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    //res.write(req.url);
    if(req.url == "/notify")
    {
        var body = "";
        req.on('data', function(chunk) {
            body += chunk;
        });
        req.on('end', function() {
            console.log("Accepting notification")
            console.log(body);
            notify(body)
            res.write("Notification sent\n")
            res.end();
        });
    }
    
});
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
        try
        {
            let o = JSON.parse(data);
            if(o.action == "register")
            {
                let sesionID = randomstring.generate(12);
                let newClient = { ws: ws, userID: o.userID, session: sesionID, info: o.payload }
                wsss.push(newClient)
            }
        }
        catch(e)
        {
            ws.send("Unknows message format")
        }

    });
    let retdata = { type: "command", parameter : "register" }
    ws.send(JSON.stringify(retdata));
});

function notify(message)
{
    try
    {
        let m = JSON.parse(message)
        let to = m.to;
        wsss.map((wsclient)=>{
            //console.log(wsclient.userID + " === " + to)
            if(wsclient.userID == to)
            {
                let msg = m.message;
                let ws = wsclient.ws;
                console.log("Sending message to " + to)
                console.log("message")
                console.log(msg)
                ws.send(msg)
            }
        })
    }
    catch(e)
    {
        console.log("error notify")
        console.log(e)
    }
}

server.listen(6666);
