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
const cartRoutes = require('./routes/cartRoutes');
const aiRoutes = require('./routes/aiRoutes');

let adminRoutes, categorieRoutes, artisteRoutes, produitRoutes, rapportRoutes, userRoutes, avisRoutes;
try { adminRoutes = require('./routes/adminRoutes'); } catch (err) { console.error('Error loading adminRoutes:', err.message); }
try { avisRoutes = require('./routes/avisRoutes'); } catch (err) { console.error('Error loading avisRoutes:', err.message); }
try { categorieRoutes = require('./routes/categorieRoutes'); } catch (err) { console.error('Error loading categorieRoutes:', err.message); }
try { artisteRoutes = require('./routes/artisteRoutes'); } catch (err) { console.error('Error loading artisteRoutes:', err.message); }
try { produitRoutes = require('./routes/produitRoutes'); } catch (err) { console.error('Error loading produitRoutes:', err.message); }
try { rapportRoutes = require('./routes/rapportRoutes'); } catch (err) { console.error('Error loading rapportRoutes:', err.message); }
try { userRoutes = require('./routes/userRoutes'); } catch (err) { console.error('Error loading userRoutes:', err.message); }
let challengeRoutes;
try { challengeRoutes = require('./routes/challengeRoutes'); } catch (err) { console.error('Error loading challengeRoutes:', err.message); }

//middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const uploadsPath = path.join(__dirname, 'uploads');
try {
    fs.mkdirSync(uploadsPath, { recursive: true });
} catch (err) {
    console.error('Failed to create uploads directory:', err.message);
}
app.use('/uploads', express.static(uploadsPath));
// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/cart', cartRoutes);
app.use('/api', commandeRoutes);
app.use('/api', aiRoutes);
console.log('Cart routes registered at /api/cart');
console.log('AI routes registered under /api');

if (avisRoutes) {
    app.use('/api/avis', avisRoutes);
    console.log('Avis routes registered');
}

if (adminRoutes) {
    app.use('/api/admin', adminRoutes);
    console.log('Admin routes registered');
}

if (categorieRoutes) {
    app.use('/api/categorie', categorieRoutes);
    console.log('Categorie route registered');
}

if (artisteRoutes) {
    app.use('/api/artiste', artisteRoutes);
    console.log('Artiste route registered');
}

if (produitRoutes) {
    app.use('/api/produit', produitRoutes);
    console.log('Produit route registered');
}

if (rapportRoutes) {
    app.use('/api', rapportRoutes);
    console.log('Rapport routes registered');
}

if (userRoutes) {
    app.use('/api/user', userRoutes);
    console.log('User routes registered');
}

if (challengeRoutes) {
    app.use('/api/challenge', challengeRoutes);
    console.log('Challenge routes registered');
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
    function print(path, layer) {
        if (layer.route) {
            layer.route.stack.forEach(print.bind(null, path + (layer.route.path || '')));
        } else if (layer.name === 'router' && layer.handle.stack) {
            layer.handle.stack.forEach(print.bind(null, path + (layer.regexp.source.replace('^\\', '').replace('\\/?(?=\\/|$)', '') || '')));
        } else if (layer.method) {
            routes.push({
                method: layer.method.toUpperCase(),
                path: path.split('(?')[0].replace(/\\/g, '') || '/'
            });
        }
    }
    app._router.stack.forEach(print.bind(null, ''));
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
