const axios = require('axios');
async function run() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'demo@store.com',
      password: 'demo123'
    });
    const token = loginRes.data.token;
    
    // Get a product
    const productsRes = await axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const product = productsRes.data.data[0];
    
    // Create bill
    const billRes = await axios.post('http://localhost:5000/api/bills', {
      items: [{
        product: product._id,
        qty: 1
      }],
      discount: 0
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Success!");
  } catch (err) {
    if (err.response) {
      console.log("ERROR STATUS:", err.response.status);
      console.log("ERROR DATA:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.log("ERROR:", err.message);
    }
  }
}
run();
