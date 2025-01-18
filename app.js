const fs = require('fs');
const WebSocket = require('ws');
const http = require('http');
const randomstring = require("randomstring");

const clients = []; // Array to store connected clients
const clientFile = 'clients.json'; // File to store client objects
const notificationsFile = 'notifications.log'; // File name for storing notifications

function loadClients() {
    fs.readFile(clientFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error loading clients from file:', err);
            return; // Exit function if error occurs
        }

        try {
            const parsedData = JSON.parse(data);
            clients.push(...parsedData); // Spread parsed data into clients array
            console.log('Clients loaded from file');
        } catch (e) {
            console.error('Error parsing client data:', e);
        }
    }); 
}

function saveClients() {
    const clientData = JSON.stringify(clients);
    fs.writeFile(clientFile, clientData, (err) => {
        if (err) {
        console.error('Error saving clients to file:', err);
        } else {
        console.log('Clients saved to file');
        }
    });
}
  
loadClients();

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  if (req.url === '/notify') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      console.log('Accepting notification');
      console.log(body);
      saveNotification(body);
      res.write('Notification saved\n');
      res.end();
    });
  } else {
    // Handle other potential routes here (optional)
  }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (data) => {
        console.log('received:', data);
        try {
            const message = JSON.parse(data);
            if (message.action === 'register') {
                const sessionID = randomstring.generate(12);
                const newClient = { socket: ws, userID: message.userID, session: sessionID, info: message.payload };
                clients.push(newClient);
                saveClients();
            }
        } catch (e) {
        ws.send('Unknown message format');
        }
    });

    ws.on('close', () => {
        // Remove disconnected client from the list
        clients = clients.filter((client) => client.ws !== ws);
        saveClients();
    });

    // Send initial registration message (optional)
    ws.send(JSON.stringify({ type: 'command', parameter: 'register' })); // Moved to 'register' handling
});

function saveNotification(message)
{
    const data = JSON.parse(message);
    const to = data.to;
    const msg = data.message;
    const from = data.from; // Extract sender information from the message

    // Save notification to file with additional information
    let notification = {
        date: new Date().toISOString(),
        from: from,
        to: to,
        message: msg
    };

    let sNotification = JSON.stringify(notification)

    fs.appendFile(notificationsFile, notification, (err) => {
        if (err) {
            console.error('Error saving notification to file:', err);
        } else {
            console.log('Notification saved to file');
        }
    });
}

function notify(message) {
    try {
        const data = JSON.parse(message);
        const to = data.to;
        const msg = data.message;
        const from = data.from; // Extract sender information from the message

        clients.forEach((client) => {
            if (client.userID === to) {
                console.log(`Sending message to ${to}`);
                console.log('message:', msg);
                client.socket.send(msg);
            }
        });


    } catch (e) {
        console.error('Error in notify:', e);
    }
}

const port = 6666;
console.log(`Server is listening on ${port}`);
server.listen(port, '0.0.0.0');