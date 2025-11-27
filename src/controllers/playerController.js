const { Player, isValidId } = require('../models/player');

const listPlayers = async (req, res, next) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 }).lean();
    res.json(players);
  } catch (err) {
    next(err);
  }
};

const getPlayer = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    if (!isValidId(playerId)) {
      return res.status(400).json({ error: 'Invalid player id' });
    }

    const player = await Player.findById(playerId).lean();
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);
  } catch (err) {
    next(err);
  }
};

const createPlayer = async (req, res, next) => {
  try {
    const { name, position, team, number } = req.body;
    const player = await Player.create({ name, position, team, number });
    res.status(201).json(player.toObject());
  } catch (err) {
    next(err);
  }
};

const updatePlayer = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    if (!isValidId(playerId)) {
      return res.status(400).json({ error: 'Invalid player id' });
    }

    const { name, position, team, number } = req.body;
    const player = await Player.findByIdAndUpdate(
      playerId,
      { name, position, team, number },
      { new: true, runValidators: true }
    ).lean();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);
  } catch (err) {
    next(err);
  }
};

const deletePlayer = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    if (!isValidId(playerId)) {
      return res.status(400).json({ error: 'Invalid player id' });
    }

    const player = await Player.findByIdAndDelete(playerId).lean();
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
