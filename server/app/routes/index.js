var express = require('express');
var router  = express.Router();

router.use('/', require('./user').router);
router.use('/', require('./group').router);
router.use('/', require('./category').router);
router.use('/', require('./todo').router);

module.exports = router;