var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    if (!req.session || !req.session.role) {
        return res.status(401).json({ msg: '未登入或角色不存在' });
    }
    res.json({ role: req.session.role });
});

module.exports = router;
