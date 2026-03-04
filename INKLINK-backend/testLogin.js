const url = 'http://localhost:3001/api/admin/login';
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'Medmoatazsarray',
        password: '1234567890GO'
    })
};

fetch(url, options)
    .then(res => {
        console.log('Status:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('Response:', JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error('Request error:', err);
    });
