(async () => {
  try {
    const res = await fetch('http://localhost:3001/debug/routes');
    console.log('Status:', res.status);
    const json = await res.json();
    console.log('Routes:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Request error:', err);
  }
})();
