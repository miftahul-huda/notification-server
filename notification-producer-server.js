
const KafkaProducer = require("./modules/kafkaproducer");
const http = require('http');


let kafkaProducer = new KafkaProducer();

const server = http.createServer((req, res) => {

    // Add CORS headers before any other headers are sent
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow GET, POST, and OPTIONS methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow Content-Type and Authorization headers
  
    if (req.method === 'OPTIONS') {
      // Handle preflight requests
      res.writeHead(204); // No content for preflight
      res.end();
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });

    
    if (req.url === '/notify' && req.method === "POST") {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
  
      req.on('end', () => {
        console.log('Accepting notification');
        console.log(body);
        kafkaProducer.send(body)
        res.write('Notification saved\n');
        res.end();
      });
    } else {
      // Handle other potential routes here (optional)
    }
});

const port = process.env.nodeKafkaProducerPort;
console.log(`Server is listening on ${port}`);
server.listen(port, '0.0.0.0');