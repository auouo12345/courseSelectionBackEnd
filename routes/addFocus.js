var express = require('express');
var router = express.Router();
var db = require('./connect');

// �ϥ�Promise�]��query
function queryAsync(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

router.post('/', async (req, res) => {
    var sid = req.session.sid;
    var cid = req.body.cid;

    // �ˬd�O�_�w�g���`�L
    try {
        let data = await queryAsync(" ",);
        if (data.length !== 0) {
            return res.json({ msg: "�w�g���`�ӽҵ{" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ msg: "���A���������~" });
    }

    // �s�W���`�O��
    try {
        await queryAsync(" ",);
        return res.json({ msg: "���`���\" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ msg: "���A���������~" });
    }
});

module.exports = router;
