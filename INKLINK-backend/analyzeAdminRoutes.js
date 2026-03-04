const adminRoutes = require('./routes/adminRoutes');

console.log('=== ADMIN ROUTES ANALYSIS ===');
console.log('adminRoutes type:', typeof adminRoutes);
console.log('adminRoutes constructor:', adminRoutes.constructor.name);

if (adminRoutes.stack) {
    console.log('\n=== Routes in stack ===');
    adminRoutes.stack.forEach((layer, index) => {
        console.log(`\nLayer ${index}:`);
        console.log('  Type:', layer.constructor.name);
        console.log('  Name:', layer.name);
        if (layer.route) {
            console.log('  Is a route');
            console.log('  Path:', layer.route.path);
            console.log('  Methods:', Object.keys(layer.route.methods));
        } else {
            console.log('  Is NOT a route (middleware)');
        }
    });
} else {
    console.log('NO stack found!');
}
