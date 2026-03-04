const url = 'http://localhost:3001/debug/routes';
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

fetch(url, options)
    .then(res => {
        console.log('Status:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('Registered routes:');
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error('Request error:', err);
    });
