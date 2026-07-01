const http = require('http');

function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', e => reject(e));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  try {
    console.log('Logging in...');
    const loginRes = await request('POST', '/api/auth/login', { email: 'demo@store.com', password: 'demo123' });
    const token = loginRes.data.token;
    
    console.log('Fetching products...');
    const prodRes = await request('GET', '/api/products', null, token);
    const product = prodRes.data.data[0];
    
    console.log('Creating bill...');
    const billRes = await request('POST', '/api/bills', {
      items: [{ product: product._id, qty: 1 }],
      discount: 0
    }, token);
    
    console.log('BILL RESPONSE:', billRes.status, JSON.stringify(billRes.data, null, 2));
  } catch (err) {
    console.log('ERROR:', err);
  }
}
run();
