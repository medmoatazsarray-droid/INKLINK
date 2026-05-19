const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

function getLocalFallbackResponse(query) {
    const q = query.toLowerCase().trim();

    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'bonjour' || q === 'salut' || q === 'slt' || q === 'coucou') {
        return "Bonjour ! Comment puis-je vous aider aujourd'hui avec vos projets d'impression et de design sur InkLink ?";
    }
    if (q.includes('comment ca va') || q.includes('ça va') || q.includes('ca va') || q.includes('how are you') || q.includes('comment vas tu') || q.includes('cv')) {
        return "Je vais super bien, merci ! Prêt à vous aider à concevoir ou personnaliser le produit idéal. Et vous, comment allez-vous aujourd'hui ?";
    }
    if (q.includes('merci') || q.includes('thank you') || q.includes('thanks')) {
        return "Je vous en prie ! C'est un plaisir de vous aider. Avez-vous d'autres questions sur nos services ?";
    }

    if (q.includes('festival') || q.includes('kit festival') || q.includes('pack festival') || q.includes('pack événement') || q.includes('event pack') || q.includes('kit') || q.includes('pack')) {
        return "Nos 'Festival Kits' (Packs événementiels) sont parfaits pour les festivals, les clubs universitaires (JCI, IEEE, Enactus, MCT, etc.) et les événements corporatifs. Ils contiennent généralement des t-shirts personnalisés, des hoodies, des badges, des stickers et des goodies. Vous pouvez personnaliser ces articles individuellement ou nous contacter pour un pack complet sur mesure !";
    }

    if (q.includes('artiste') || q.includes('art') || q.includes('creation') || q.includes('création') || q.includes('creations')) {
        return "Découvrez des designs uniques réalisés par des artistes locaux tunisiens sur la page 'Artiste Creations' (/artiste-creations). Vous pouvez parcourir leurs galeries, explorer leurs univers créatifs, et appliquer leurs superbes illustrations sur nos vêtements et objets personnalisables !";
    }

    if (q.includes('ai-generator') || q.includes('ai generator') || q.includes('design generator') || q.includes('générateur design') || q.includes('generer') || q.includes('générer') || q.includes('logo') || q.includes('branding')) {
        return "Notre outil 'AI Generator' (/ai-generator) vous permet de générer instantanément un kit d'identité de marque complet (comprenant un logo personnalisé, une maquette de carte de visite et un design de t-shirt) adapté à votre projet en saisissant simplement le nom et l'ambiance souhaitée.";
    }

    if (q.includes('preview') || q.includes('kit-preview') || q.includes('maquette') || q.includes('visualiser')) {
        return "Sur la page 'Kit Preview' (/kit-preview), vous pouvez visualiser sous tous ses angles le pack d'identité de marque généré par l'IA (votre t-shirt, vos cartes de visite, etc.) et ajouter l'ensemble du kit directement au panier en un seul clic !";
    }

    if (q.includes('apprentissage') || q.includes('apprendre') || q.includes('interactive') || q.includes('cours') || q.includes('workshop') || q.includes('learning')) {
        return "Le module 'Interactive Design Learning' (/interactive-design) est un atelier interactif conçu pour vous initier au design graphique. Vous pouvez y concevoir vos produits étape par étape tout en apprenant les règles fondamentales de composition (contrastes, harmonies de couleurs, typographies).";
    }

    if (q.includes('challenge') || q.includes('challenges') || q.includes('concours') || q.includes('compétition') || q.includes('vote')) {
        return "Consultez notre page 'Challenges' (/challenges) pour participer ou voter pour les meilleures créations graphiques ! C'est un espace communautaire dynamique où les designers tunisiens s'affrontent sur différents thèmes artistiques.";
    }

    if (q.includes('t-shirt') || q.includes('tee-shirt') || q.includes('teeshirt') || q.includes('tshirt') || q.includes('vetement') || q.includes('vêtement')) {
        return "Nos T-shirts sont fabriqués en coton 100% premium de haute qualité. Ils sont entièrement personnalisables à l'avant et à l'arrière. Disponibles en plusieurs tailles (S à XXL) et couleurs sur la page 'Explore products' (/explore-products) !";
    }
    if (q.includes('hoodie') || q.includes('sweat') || q.includes('pull')) {
        return "Nos Hoodies (sweats à capuche) sont molletonnés, super confortables et parfaits pour l'hiver ou les mi-saisons. Ils offrent un excellent rendu pour le flocage HD ou la sérigraphie de vos logos de clubs ou designs personnels.";
    }

    
    if (q.includes('mug') || q.includes('tasse') || q.includes('tasses')) {
        return "Nos mugs personnalisés en céramique de haute qualité sont parfaits pour le bureau ou pour offrir en cadeau. Ils résistent au lave-vaisselle et au micro-ondes. Prix standard à partir de 15 DT l'unité.";
    }

    if (q.includes('carte de visite') || q.includes('business card') || q.includes('carte visite')) {
        return "Imprimez vos cartes de visite professionnelles de qualité supérieure (papier couché 350g/m²) avec finitions mates ou brillantes. Packs disponibles à partir de 180 DT pour 100 pièces, personnalisables sur la page de paiement (/business-card-payment).";
    }

    if (q.includes('stylo') || q.includes('stylos') || q.includes('pen')) {
        return "Nos stylos publicitaires personnalisés sont des goodies incontournables pour les événements ou le branding de votre club ou entreprise. Nous proposons divers coloris et finitions.";
    }

    if (q.includes('panier') || q.includes('commander') || q.includes('payer') || q.includes('achat') || q.includes('order') || q.includes('checkout') || q.includes('livraison') || q.includes('tunisie')) {
        return "Pour finaliser vos achats, rendez-vous sur la page Panier (/panier) pour passer votre commande en toute sécurité. Nous assurons la livraison rapide à domicile partout en Tunisie sous 3 à 5 jours ouvrés !";
    }

    if (q.includes('profil') || q.includes('compte') || q.includes('modifier profil') || q.includes('mon compte') || q.includes('historique')) {
        return "Vous pouvez consulter et mettre à jour vos coordonnées, mot de passe et adresses de livraison directement depuis votre espace personnel sur la page de Profil (/profil).";
    }

    return "InkLink est la première plateforme tunisienne de design et d'impression personnalisée. Nous vous aidons à concrétiser vos projets de personnalisation (t-shirts, hoodies, mugs, cartes de visite) individuels ou pour clubs, tout en mettant en valeur les artistes locaux. Dites-moi quel produit ou service vous intéresse !";
}

router.post('/ai/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Le message est requis." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY n'est pas configuré. Utilisation du fallback local.");
        const fallbackReply = getLocalFallbackResponse(message);
        return res.json({ reply: fallbackReply, source: "fallback_local" });
    }

    try {
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are InkLink AI assistant helping users with branding, tshirts, printing, logos, artists, posters, and product descriptions. Keep your responses extremely concise and to the point (maximum 2-3 short sentences). Avoid long paragraphs. If the user asks something completely unrelated to InkLink, politely explain that you are the InkLink assistant and can only help with InkLink services and products."
        });

        const result = await model.generateContent(message);
        let reply;
        try {
            reply = result.response.text();
            if (!reply || reply.trim() === "") {
                reply = getLocalFallbackResponse(message);
            }
        } catch (textErr) {
            reply = getLocalFallbackResponse(message);
        }

        return res.json({ reply: reply, source: "gemini_api" });

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini (Utilisation du fallback) :", error.message || error);
        const fallbackReply = getLocalFallbackResponse(message);
        return res.json({ reply: fallbackReply, source: "fallback_local" });
    }
});

module.exports = router;
