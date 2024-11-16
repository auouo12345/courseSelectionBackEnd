var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    if (!req.session || !req.session.role) {
        return res.status(401).json({ msg: '���n�J�Ψ��⤣�s�b' });
    }
    res.json({ role: req.session.role });
});

module.exports = router;
