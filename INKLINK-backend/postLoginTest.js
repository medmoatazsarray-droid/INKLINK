(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Medmoatazsarray', password: '1234567890GO' })
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response body:\n', text);
  } catch (err) {
    console.error('Request error:', err);
  }
})();
