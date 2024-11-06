var express = require('express');
var router = express.Router();
var db = require('./connect');

router.post('/' , (req , res) => {

    var cid = req.body.cid;

    db.query('SELECT timeid FROM course_timetable WHERE cid = ?' , [cid] , (err , data) => {

        if(err) {

            console.log(err.message);
            return res.status(500).json({msg: "伺服器內部錯誤"});

        } else {

            return res.json(data);
        }
    })
});

module.exports = router;