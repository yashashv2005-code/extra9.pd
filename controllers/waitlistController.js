const { matchedData } = require('express-validator');
const model = require('../models/waitlistModel');
const { trackInteraction } = require('../utils/analytics');

const sendNotFound = (res, message = 'Player not found') => res.status(404).json({ success: false, message, errors: [] });
const sendEmpty = (res) => res.status(200).json({ success: true, message: 'No data found', data: [] });

const getAll = async (req, res, next) => {
  try {
    let records = await model.findAll();
    if (!records.length) return sendEmpty(res);
    if (req.query.sort === 'priority') records = records.sort((a, b) => a.priority - b.priority);
    return res.json({ success: true, message: 'Players retrieved successfully', data: records });
  } catch (error) { return next(error); }
};

const getOne = async (req, res, next) => {
  try {
    const record = await model.findById(req.params.id);
    return record ? res.json({ success: true, message: 'Player retrieved successfully', data: record }) : sendNotFound(res);
  } catch (error) { return next(error); }
};

const create = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ['body'] });
    if (await model.findByEmail(data.email)) return res.status(409).json({ success: false, message: 'Email already exists', errors: [] });
    const record = await model.create(data);
    trackInteraction();
    return res.status(201).json({ success: true, message: 'Player created successfully', data: record });
  } catch (error) { return next(error); }
};

const update = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ['body'] });
    if (data.email && await model.findByEmail(data.email, req.params.id)) return res.status(409).json({ success: false, message: 'Email already exists', errors: [] });
    const record = await model.update(req.params.id, data);
    if (!record) return sendNotFound(res);
    trackInteraction();
    return res.json({ success: true, message: 'Player updated successfully', data: record });
  } catch (error) { return next(error); }
};

const remove = async (req, res, next) => {
  try {
    const record = await model.remove(req.params.id);
    if (!record) return sendNotFound(res);
    trackInteraction();
    return res.json({ success: true, message: 'Player deleted successfully', data: record });
  } catch (error) { return next(error); }
};

const search = async (req, res, next) => {
  try {
    const records = await model.searchByGame(req.params.game);
    return records.length ? res.json({ success: true, message: 'Search completed successfully', data: records }) : sendEmpty(res);
  } catch (error) { return next(error); }
};

const byStatus = async (req, res, next) => {
  try {
    const records = await model.findByStatus(req.params.status);
    return records.length ? res.json({ success: true, message: 'Status filter completed successfully', data: records }) : sendEmpty(res);
  } catch (error) { return next(error); }
};

module.exports = { getAll, getOne, create, update, remove, search, byStatus };
