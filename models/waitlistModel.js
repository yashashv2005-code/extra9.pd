const { randomUUID } = require('crypto');
const fileStore = require('../utils/fileStore');

const create = async (attributes) => {
  const records = await fileStore.readAll();
  const now = new Date().toISOString();
  const record = {
    id: randomUUID(),
    playerName: attributes.playerName,
    email: attributes.email.toLowerCase(),
    gameName: attributes.gameName,
    priority: attributes.priority,
    status: attributes.status || 'waiting',
    createdAt: now,
    updatedAt: now
  };
  records.push(record);
  await fileStore.writeAll(records);
  return record;
};

const findAll = async () => fileStore.readAll();

const findById = async (id) => {
  const records = await fileStore.readAll();
  return records.find((record) => record.id === id) || null;
};

const findByEmail = async (email, exceptId = null) => {
  const records = await fileStore.readAll();
  return records.find((record) => record.email === email.toLowerCase() && record.id !== exceptId) || null;
};

const searchByGame = async (game) => {
  const records = await fileStore.readAll();
  const searchTerm = game.toLowerCase();
  return records.filter((record) => record.gameName.toLowerCase().includes(searchTerm));
};

const findByStatus = async (status) => {
  const records = await fileStore.readAll();
  return records.filter((record) => record.status === status);
};

const update = async (id, attributes) => {
  const records = await fileStore.readAll();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return null;

  records[index] = {
    ...records[index],
    ...attributes,
    email: attributes.email ? attributes.email.toLowerCase() : records[index].email,
    updatedAt: new Date().toISOString()
  };
  await fileStore.writeAll(records);
  return records[index];
};

const remove = async (id) => {
  const records = await fileStore.readAll();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return null;
  const [deleted] = records.splice(index, 1);
  await fileStore.writeAll(records);
  return deleted;
};

module.exports = { create, findAll, findById, findByEmail, searchByGame, findByStatus, update, remove };
