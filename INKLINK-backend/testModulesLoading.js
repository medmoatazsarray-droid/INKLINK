console.log('Testing module loading...');

try {
    const adminRoutes = require('./routes/adminRoutes');
    console.log('adminRoutes loaded successfully');
    console.log('adminRoutes type:', typeof adminRoutes);
    console.log('adminRoutes:', adminRoutes);
} catch (err) {
    console.error('Error loading adminRoutes:', err.message);
    console.error('Full error:', err);
}

try {
    const adminController = require('./controllers/adminController');
    console.log('adminController loaded successfully');
    console.log('adminController exports:', Object.keys(adminController));
} catch (err) {
    console.error('Error loading adminController:', err.message);
}

try {
    const adminModel = require('./routes/models/adminModel');
    console.log('adminModel loaded successfully');
    console.log('adminModel methods:', Object.keys(adminModel));
} catch (err) {
    console.error('Error loading adminModel:', err.message);
}
