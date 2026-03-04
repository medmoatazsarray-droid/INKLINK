const url = 'http://localhost:3001/api/admin/forgot-password';
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'admin@inklink.local'
    })
};

console.log('Sending request to:', url);
console.log('Method:', options.method);
console.log('Body:', options.body);

fetch(url, options)
    .then(res => {
        console.log('Status:', res.status);
        if (!res.ok) {
            return res.text();
        }
        return res.json();
    })
    .then(data => {
        console.log('Response:', JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error('Request error:', err);
    });
