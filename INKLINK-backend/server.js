//server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const express= require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const fs = require('fs');
const app=express();
const PORT = process.env.PORT || 3000;
const commandeRoutes = require('./routes/commandeRoutes');

let adminRoutes, categorieRoutes, artisteRoutes, produitRoutes, rapportRoutes, userRoutes;
try { adminRoutes = require('./routes/adminRoutes'); }
catch (err) { console.error('Error loading adminRoutes:', err.message); }
try { categorieRoutes = require('./routes/categorieRoutes'); }
catch (err) { console.error('Error loading categorieRoutes:', err.message); }
try { artisteRoutes = require('./routes/artisteRoutes'); }
catch (err) { console.error('Error loading artisteRoutes:', err.message); }
try { produitRoutes = require('./routes/produitRoutes'); }
catch (err) { console.error('Error loading produitRoutes:', err.message); }
try { rapportRoutes = require('./routes/rapportRoutes'); }
catch (err) { console.error('Error loading rapportRoutes:', err.message); }
try { userRoutes = require('./routes/userRoutes'); }
catch (err) { console.error('Error loading userRoutes:', err.message); }

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend : true}));
const uploadsPath = path.join(__dirname, 'uploads');
try {
    fs.mkdirSync(uploadsPath, { recursive: true });
} catch (err) {
    console.error('Failed to create uploads directory:', err.message);
}
app.use('/uploads', express.static(uploadsPath));
app.use('/api', commandeRoutes);

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

if (adminRoutes) {
    app.use('/api/admin', adminRoutes);
    console.log('Admin routes registered');
}

if (categorieRoutes) {
    app.use('/api/categories', categorieRoutes);
    console.log('Categorie routes registered');
}

if (artisteRoutes) {
    app.use('/api/artistes', artisteRoutes);
    console.log('Artiste routes registered');
}

if (produitRoutes) {
    app.use('/api/produits', produitRoutes);
    console.log('Produit routes registered');
}

if (rapportRoutes) {
    app.use('/api', rapportRoutes);
    console.log('Rapport routes registered');
}

if (userRoutes) {
    app.use('/api/user', userRoutes);
    console.log('User routes registered');
}

// Error handler (including multer errors)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err.statusCode || err.status || 500;
    res.status(status).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production'
            ? { details: err.code || err.name || 'UnhandledError' }
            : {})
    });
});
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
