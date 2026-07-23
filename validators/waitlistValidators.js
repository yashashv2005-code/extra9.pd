const { body } = require('express-validator');

const clean = (value) => typeof value === 'string' ? value.trim().replace(/[<>]/g, '') : value;
const playerName = body('playerName').customSanitizer(clean).isString().withMessage('playerName is required').bail().isLength({ min: 3 }).withMessage('playerName must be at least 3 characters');
const email = body('email').customSanitizer(clean).isEmail({ require_tld: true, allow_ip_domain: false, allow_utf8_local_part: false }).withMessage('email must be a valid email address with a real domain, such as player@example.com').custom((value) => {
  const [localPart, domain] = value.split('@');
  if (!localPart || localPart.length > 64 || !domain || domain.length > 253 || domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) throw new Error('email format is invalid');
  return true;
}).normalizeEmail();
const gameName = body('gameName').customSanitizer(clean).isString().withMessage('gameName is required').bail().notEmpty().withMessage('gameName is required');
const priority = body('priority').isInt({ min: 1, max: 5 }).withMessage('priority must be an integer between 1 and 5').toInt();
const status = body('status').optional().isIn(['waiting', 'approved', 'rejected']).withMessage('status must be waiting, approved, or rejected');

const createRules = [playerName, email, gameName, priority, status];
const updateRules = [playerName.optional(), email.optional(), gameName.optional(), priority.optional(), status];

module.exports = { createRules, updateRules };
