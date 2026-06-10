const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeMessagePayload } = require('../controllers/messageController');

test('normalizeMessagePayload trims the content and resolves the artist id', () => {
  const payload = normalizeMessagePayload({
    id_artiste: '7',
    contenu: '  Hello there  ',
    nom_utilisateur: '  Jane  ',
    email_utilisateur: ' jane@example.com ',
    id_utilisateur: '15',
  });

  assert.equal(payload.artistId, 7);
  assert.equal(payload.content, 'Hello there');
  assert.equal(payload.senderName, 'Jane');
  assert.equal(payload.senderEmail, 'jane@example.com');
  assert.equal(payload.userId, 15);
});

test('normalizeMessagePayload falls back to a default sender label when missing', () => {
  const payload = normalizeMessagePayload({ id_artiste: 3, contenu: 'Hi' });

  assert.equal(payload.artistId, 3);
  assert.equal(payload.content, 'Hi');
  assert.equal(payload.senderName, 'Visitor');
  assert.equal(payload.senderEmail, null);
  assert.equal(payload.userId, null);
});
