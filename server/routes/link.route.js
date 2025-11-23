// routes/links.js
const express = require('express');
const router = express.Router();
const linkCtrl = require('../controllers/link.controller');

router.post('/', linkCtrl.createLink);
router.get('/', linkCtrl.listLinks);
router.get('/:code', linkCtrl.getLink);
router.get('/redirect/:code',linkCtrl.handleRedirect);
router.delete('/:code', linkCtrl.deleteLink);

module.exports = router;
