const express = require('express');
const {
  listPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = require('../controllers/playerController');

const router = express.Router();

router.get('/', listPlayers);
router.get('/:playerId', getPlayer);
router.post('/', createPlayer);
router.put('/:playerId', updatePlayer);
router.delete('/:playerId', deletePlayer);

module.exports = router;
