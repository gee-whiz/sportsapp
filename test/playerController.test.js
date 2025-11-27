const test = require('node:test');
const assert = require('node:assert/strict');
const {
  listPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = require('../src/controllers/playerController');
const { Player } = require('../src/models/player');

const validId = '507f1f77bcf86cd799439011';

const originalMethods = {
  find: Player.find,
  findById: Player.findById,
  create: Player.create,
  findByIdAndUpdate: Player.findByIdAndUpdate,
  findByIdAndDelete: Player.findByIdAndDelete,
};

const createRes = () => {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    sendStatus(code) {
      this.statusCode = code;
      return this;
    },
  };
  return res;
};

test.afterEach(() => {
  Object.assign(Player, originalMethods);
});

test('listPlayers returns players sorted newest-first', async () => {
  const mockPlayers = [
    { _id: 'b', name: 'Player B' },
    { _id: 'a', name: 'Player A' },
  ];
  Player.find = () => ({
    sort: () => ({
      lean: async () => mockPlayers,
    }),
  });

  const res = createRes();
  const nextCalls = [];
  await listPlayers({}, res, (err) => nextCalls.push(err));

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, mockPlayers);
  assert.equal(nextCalls.length, 0);
});

test('getPlayer rejects invalid ids', async () => {
  const res = createRes();
  const nextCalls = [];

  await getPlayer({ params: { playerId: 'invalid-id' } }, res, (err) =>
    nextCalls.push(err)
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'Invalid player id' });
  assert.equal(nextCalls.length, 0);
});

test('getPlayer returns 404 when not found', async () => {
  Player.findById = () => ({
    lean: async () => null,
  });

  const res = createRes();
  await getPlayer({ params: { playerId: validId } }, res, () => {});

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { error: 'Player not found' });
});

test('getPlayer returns a player when found', async () => {
  const mockPlayer = { _id: validId, name: 'Jane Doe' };
  Player.findById = () => ({
    lean: async () => mockPlayer,
  });

  const res = createRes();
  await getPlayer({ params: { playerId: validId } }, res, () => {});

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, mockPlayer);
});

test('createPlayer persists and returns created player', async () => {
  Player.create = async (payload) => ({
    toObject: () => ({ _id: validId, ...payload }),
  });

  const body = { name: 'New Player', position: 'Guard', team: 'A', number: 5 };
  const res = createRes();
  await createPlayer({ body }, res, () => {});

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, { _id: validId, ...body });
});

test('updatePlayer rejects invalid ids', async () => {
  const res = createRes();
  const nextCalls = [];

  await updatePlayer({ params: { playerId: 'invalid' }, body: {} }, res, (err) =>
    nextCalls.push(err)
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'Invalid player id' });
  assert.equal(nextCalls.length, 0);
});

test('updatePlayer returns 404 when player is missing', async () => {
  Player.findByIdAndUpdate = () => ({
    lean: async () => null,
  });

  const res = createRes();
  await updatePlayer({ params: { playerId: validId }, body: {} }, res, () => {});

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { error: 'Player not found' });
});

test('updatePlayer returns the updated player', async () => {
  const updated = { _id: validId, name: 'Updated Name' };
  Player.findByIdAndUpdate = (id, payload) => ({
    lean: async () => {
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
      );
      return { ...updated, ...cleanedPayload };
    },
  });

  const res = createRes();
  await updatePlayer(
    {
      params: { playerId: validId },
      body: { name: 'Updated Name', position: 'Forward' },
    },
    res,
    () => {}
  );

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { _id: validId, name: 'Updated Name', position: 'Forward' });
});

test('deletePlayer rejects invalid ids', async () => {
  const res = createRes();
  await deletePlayer({ params: { playerId: 'bad' } }, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'Invalid player id' });
});

test('deletePlayer returns 404 when player does not exist', async () => {
  Player.findByIdAndDelete = () => ({
    lean: async () => null,
  });

  const res = createRes();
  await deletePlayer({ params: { playerId: validId } }, res, () => {});

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { error: 'Player not found' });
});

test('deletePlayer returns 204 on success', async () => {
  Player.findByIdAndDelete = () => ({
    lean: async () => ({ _id: validId, name: 'Gone' }),
  });

  const res = createRes();
  await deletePlayer({ params: { playerId: validId } }, res, () => {});

  assert.equal(res.statusCode, 204);
  assert.equal(res.body, undefined);
});
