const fs = require('fs');
const path = require('path');
const components = [
    'event-page', 'event-detail', 'product-page', 'personal-products',
    'product-detail', 'customizing', 'ai-generator-page', 'kit-preview',
    'interactive-design', 'about-artiste'
];
const basePath = path.join(__dirname, 'src', 'app');

const cssAnim = `

/* Pure CSS Scroll Animation */
@keyframes cssScrollReveal {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.reveal {
    animation: cssScrollReveal linear both !important;
    animation-timeline: view() !important;
    animation-range: entry 5% cover 15% !important;
    visibility: visible !important;
}
`;

for (const comp of components) {
    const cssFile = path.join(basePath, comp, comp + (comp === 'customizing' ? '.component.css' : '.css'));
    if (!fs.existsSync(cssFile)) continue;
    
    let css = fs.readFileSync(cssFile, 'utf8');
    if (!css.includes('cssScrollReveal')) {
        fs.writeFileSync(cssFile, css + cssAnim);
        console.log('Updated CSS:', cssFile);
    }
}
