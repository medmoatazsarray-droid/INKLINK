const db = require('../config/db');

exports.getActivePromo = (req, res) => {
  const sql = `
    SELECT id_code, nom, remise, dateExpiration
    FROM codepromo
    WHERE dateExpiration IS NULL OR dateExpiration >= CURDATE()
    ORDER BY CASE WHEN dateExpiration IS NULL THEN 0 ELSE 1 END, dateExpiration ASC, id_code DESC
    LIMIT 1
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching active promo:', err);
      return res.status(500).json({ message: 'Unable to load promotion.' });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No active promotion found.' });
    }

    const promo = results[0];
    const discount = Number(promo.remise || 0);

    return res.json({
      id_code: promo.id_code,
      title: promo.nom || 'Seasonal promotion',
      description: discount > 0
        ? `Enjoy ${discount}% off your next order.`
        : 'Enjoy an exclusive offer for a limited time.',
      discount,
      badgeText: discount > 0 ? `-${discount}%` : 'Offer',
      validUntil: promo.dateExpiration
    });
  });
};
