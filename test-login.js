async function testLogin() {
  try {
    const csrfRes = await fetch('http://localhost:5173/api/v1/csrf-token');
    console.log('CSRF Status:', csrfRes.status);
    const csrfData = await csrfRes.json();
    console.log('CSRF Token:', csrfData.token);
    
    const loginRes = await fetch('http://localhost:5173/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.token
      },
      body: JSON.stringify({username: 'admin', password: 'password'})
    });
    console.log('Login Status:', loginRes.status);
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
  } catch (err) {
    console.error('Test Error:', err);
  }
}
testLogin();
