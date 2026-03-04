//server.js
require('dotenv').config();
const express= require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const app=express();
const PORT = process.env.PORT || 3000;

let adminRoutes;
try {
    adminRoutes = require('./routes/adminRoutes');
    console.log('Admin routes loaded successfully');
} catch (err) {
    console.error('Error loading admin routes:', err.message);
}

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend : true}));

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

if (adminRoutes) {
    app.use('/api/admin', adminRoutes);
    console.log('Admin routes registered');
    // Log registered routes
    if (adminRoutes.stack) {
        console.log('Admin routes in stack:');
        adminRoutes.stack.forEach((layer, index) => {
            if (layer.route) {
                const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
                console.log(`  [${index}] ${methods} ${layer.route.path}`);
            }
        });
    }
} else {
    console.error('Admin routes not registered - adminRoutes is undefined');
}
// debug: list registered routes
app.get('/debug/routes', (req, res) => {
    const routes = [];
    if (app._router && app._router.stack) {
        app._router.stack.forEach((middleware) => {
            if (middleware.route) {
                // routes registered directly on the app
                const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
                routes.push({ path: middleware.route.path, methods });
            } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
                // router middleware
                middleware.handle.stack.forEach((handler) => {
                    if (handler.route) {
                        const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
                        routes.push({ path: handler.route.path, methods });
                    }
                });
            }
        });
    }
    res.json(routes);
});
//test-route
app.get('/',(req,res)=>
{
    res.json({
        message:'INKLINK API is running',
        project : 'Étincelle Design Agency'
    });
});
//start server
app.listen(PORT,()=>
{
    console.log(`serveur running on http://localhost:${PORT}`);
})