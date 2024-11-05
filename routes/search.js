var express = require('express');
var router = express.Router();
var db = require('./connect');

router.post('/' , async (req , res) => {

    let pattern = `%${req.body.pattern}%`
    let sql = "SELECT * FROM course WHERE (cid LIKE ? OR name LIKE ?)";

    if(req.body.liberal) {

        sql += "AND dept = '通識'"
    }

    if(req.body.elective) {

        sql += "AND required = '0'"
    }

    if(req.body.week.length !== 0) {

        sql += `AND cid IN (SELECT cid FROM course_timetable WHERE (timeid / 14 = '${req.body.week[0]}'`;

        for(let i = 1 ; i < req.body.week.length ; i++) {

            sql += ` OR timeid / 14 = '${req.body.week[i]}'`;
        }

        sql += "))";
    }

    db.query(sql , [pattern , pattern] , (err , data) => {

        if(err) {

            console.log(err.message);
            return res.status(500).json({msg: "伺服器內部錯誤"});

        } else {

            return res.json(data);
        }
    })
});

module.exports = router;