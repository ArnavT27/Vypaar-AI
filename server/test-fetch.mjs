async function run() {
  try {
    const loginRes = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@store.com', password: 'demo123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    const prodRes = await fetch('http://127.0.0.1:3000/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const prodData = await prodRes.json();
    const product = prodData.data[0];
    
    const billRes = await fetch('http://127.0.0.1:3000/api/bills', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{ product: product._id, qty: 1 }],
        discount: 0
      })
    });
    const billData = await billRes.json();
    console.log("RESPONSE:", JSON.stringify(billData, null, 2));
  } catch (err) {
    console.log("ERROR:", err.message);
  }
}
run();
