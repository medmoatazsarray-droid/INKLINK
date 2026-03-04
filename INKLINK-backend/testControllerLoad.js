console.log('Testing controller loading...');

try {
    const controller = require('./controllers/adminController');
    console.log('Controller exports:', Object.keys(controller));
    console.log('forgotPassword exists:', typeof controller.forgotPassword);
} catch (err) {
    console.error('Error loading controller:', err.message);
    console.error('Full error:', err);
}
