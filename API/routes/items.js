const express = require('express');
const router = express.Router();

router.get('/' , (req, res)=> {
    res.send('Here is items');
});

router.get('/:id' , (req, res)=> {
    res.send('Here is item 1');
});

module.exports = router;