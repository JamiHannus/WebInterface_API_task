const express = require('express');
const router = express.Router();

router.get('/' , (req, res)=> {
    res.send('Here is users');
});

router.get('/' , (req, res)=> {
    res.send('Here is user 1');
});

module.exports = router;