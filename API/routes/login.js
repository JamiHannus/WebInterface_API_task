const express = require('express');
const router = express.Router();

router.post('/' , (req, res)=> {
    res.send('Here be token giving');
});


module.exports = router;