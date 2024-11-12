var express = require('express');
var router = express.Router();
var db = require('./connect');

router.get('/', (req, res) => {

    var sid = req.session.sid;

    db.query('SELECT cid , cname FROM attention WHERE sid = ?', [sid], (err, data) => {

        if (err) {

            console.log(err.message);
            return res.status(500).json({ msg: "���A���������~" });

        } else {

            return res.json(data[0]);
        }
    })
});

module.exports = router;
