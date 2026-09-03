const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod');
const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/students',
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
}, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => { console.log(data); });
});
req.on('error', e => { console.error(e); });
req.end();
