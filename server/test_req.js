const http = require('http');

const data = JSON.stringify({
  name: "Test User 2",
  email: "test_new4@test.com",
  password: "password123",
  role: "employee"
});

const options = {
  hostname: '127.0.0.1',
  port: 5001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => { body += d; });
  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    console.log('Response body:', body);
  });
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
