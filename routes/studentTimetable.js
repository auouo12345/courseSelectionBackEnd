var express = require('express');
var router = express.Router();
var db = require('./connect');

router.get('/' , (req , res) => {

    var sid = req.session.sid;

    db.query('SELECT cid , timeid , cname FROM student_timetable WHERE sid = ?' , [sid] , (err , data) => {

        if(err) {

            console.log(err.message);
            return res.status(500).json({msg: "伺服器內部錯誤"});

        } else {

            return res.json(data);
        }
    })
});

module.exports = router;