const db = require('../config/db');

const normalizeMessagePayload = (body = {}) => {
  const artistId = Number(body?.id_artiste ?? body?.artistId);
  const content = String(body?.contenu ?? body?.message ?? '').trim();
  const senderName = body?.nom_utilisateur ? String(body.nom_utilisateur).trim() : 'Visitor';
  const senderEmail = body?.email_utilisateur ? String(body.email_utilisateur).trim() : null;
  const userId = body?.id_utilisateur ? Number(body.id_utilisateur) : null;

  return {
    artistId: Number.isInteger(artistId) ? artistId : null,
    content,
    senderName: senderName || 'Visitor',
    senderEmail,
    userId: Number.isInteger(userId) ? userId : null,
  };
};

const ensureMessagesTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS messages (
      id_message INT AUTO_INCREMENT PRIMARY KEY,
      id_artiste INT NOT NULL,
      id_utilisateur INT NULL,
      nom_utilisateur VARCHAR(100) NULL,
      email_utilisateur VARCHAR(255) NULL,
      contenu TEXT NOT NULL,
      lu TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_messages_artiste (id_artiste, lu, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error('Error ensuring messages table exists:', err.message);
    }
  });
};

ensureMessagesTable();

exports.normalizeMessagePayload = normalizeMessagePayload;

exports.getMessagesByArtist = (req, res) => {
  const artistId = Number(req.params.artistId);

  if (!Number.isInteger(artistId)) {
    return res.status(400).json({ message: 'Invalid artist id' });
  }

  db.query(
    'SELECT * FROM messages WHERE id_artiste = ? ORDER BY created_at DESC',
    [artistId],
    (err, results) => {
      if (err) {
        console.error('Database error fetching messages:', err);
        return res.status(500).json({ message: 'Error fetching messages' });
      }

      const messages = results || [];
      const unreadCount = messages.filter((msg) => Number(msg.lu) === 0).length;

      res.status(200).json({ messages, unreadCount });
    }
  );
};

exports.createMessage = (req, res) => {
  const payload = normalizeMessagePayload(req.body);

  if (!payload.artistId) {
    return res.status(400).json({ message: 'Artist id is required' });
  }

  if (!payload.content) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  db.query(
    'INSERT INTO messages (id_artiste, id_utilisateur, nom_utilisateur, email_utilisateur, contenu) VALUES (?, ?, ?, ?, ?)',
    [payload.artistId, payload.userId, payload.senderName, payload.senderEmail, payload.content],
    (err, result) => {
      if (err) {
        console.error('Database error creating message:', err);
        return res.status(500).json({ message: 'Error sending message' });
      }

      res.status(201).json({
        message: 'Message sent successfully',
        id_message: result.insertId,
      });
    }
  );
};

exports.markMessagesAsRead = (req, res) => {
  const artistId = Number(req.params.artistId);

  if (!Number.isInteger(artistId)) {
    return res.status(400).json({ message: 'Invalid artist id' });
  }

  db.query('UPDATE messages SET lu = 1 WHERE id_artiste = ? AND lu = 0', [artistId], (err, result) => {
    if (err) {
      console.error('Database error marking messages as read:', err);
      return res.status(500).json({ message: 'Error updating message status' });
    }

    res.status(200).json({ message: 'Messages marked as read', updatedRows: result.affectedRows || 0 });
  });
};
