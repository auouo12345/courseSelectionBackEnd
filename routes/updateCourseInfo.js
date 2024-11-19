var express = require('express');
var router = express.Router();
var db = require('./connect');

//使用Promise包裝query
function queryAsync(query, params) {

    return new Promise((resolve, reject) => {

        db.query(query, params, (err, results) => {

            if (err) {

                return reject(err);
            }

            resolve(results);
        });
    });
}

router.post('/' , async (req , res) => {

    let tid = req.session.tid;
    let cid = req.body.cid;
    let name = req.body.name;
    let timeTable = req.body.timetable;
    let classRoom = req.body.classRoom;
    console.log(tid);
    console.log(cid);
    console.log(name);
    console.log(timeTable);

    if(!tid || !cid || !name || !timeTable) {

        return res.status(500).json({msg: "伺服器內部錯誤"});
    }

    try {

        let students = await queryAsync('SELECT * FROM course_selection WHERE cid = ?' , [cid]);

        if(students.length !== 0) {

            return res.json({msg: "該課程已有人加選"});
        }
    } catch (err) {

        console.log(err.message);
        return res.status(500).json({msg: "伺服器內部錯誤"});
    }

    try{

        await queryAsync('UPDATE course SET name = ? WHERE cid = ?' , [cid , name]);
        await queryAsync('UPDATE course SET location = ? WHERE cid = ?' , [classRoom , cid]);
        await queryAsync("DELETE FROM course_timetable WHERE cid = ?" , [cid]);
        await queryAsync("DELETE FROM teacher_timetable WHERE tid = ? AND cid = ?" , [tid , cid]);

        for(const time of timeTable) {

            await queryAsync('INSERT INTO course_timetable (cid , timeid) VALUES (? , ?)' , [cid , time]);
            await queryAsync('INSERT INTO teacher_timetable (tid , cid , timeid , cname) VALUES (? , ? , ? , ?)' , [tid , cid , time , name]);
        }
    } catch (err) {

        console.log(err.message);
        return res.status(500).json({msg: "伺服器內部錯誤"});
    }

    return res.json({msg: "修改成功"});
});

module.exports = router;