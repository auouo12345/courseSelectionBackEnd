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

    var sid = req.session.sid;
    var cid = req.body.cid;

    console.log("getting courseInfo");
    //整理課程資訊
    var courseInfo = await db.query("SELECT * FROM course WHERE cid = ?" , [cid] , (err , data) => {

        if(err) {

            console.log(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});

        } else if(data.length === 0) {

            res.json({msg: "課程不存在"});
        }
    });

    console.log("getting studentInfo");
    //整理學生資訊
    var studentInfo = await db.query("SELECT * FROM students WHERE sid = ?" , [sid] , (err , data) => {

        if(err) {

            console.log(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});

        } else if(data.length === 0) {

            res.json({msg: "帳號不存在"});
        }
    });

    //判斷系所是否相同
    if(studentInfo.dept !== courseInfo.dept) {

        res.json({msg: "系所不一"});
    }

    //判斷是否超過學分上限
    if(studentInfo.credit + courseInfo > 30) {

        res.json({msg: "超過學分上限"});
    }

    //判斷課程是否已滿
    if(courseInfo.max_quantity < courseInfo.current_quantity) {

        res.json({msg: "課程已滿"});
    }

    //判斷課程衝堂
    await db.query("SELECT * FROM student_timetable WHERE sid = ? AND timeid IN (SELECT timeid FROM course_timetable WHERE cid = ?)" , [sid , cid] , (err , data) => {

        if(err) {

            console.log(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});

        } else if(data.length !== 0) {

            res.json({msg: "課程衝堂"});
        }
    });

    //判斷是否加選同名課程
    await db.query("SELECT * FROM course_selection WHERE sid = ? AND name = ?" , [sid , courseInfo.name] , (err , data) => {

        if(err) {

            console.log(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});

        } else if(data.length !== 0) {

            res.json({msg: "不可加選與已選課程同名的課程"});
        }
    });

    //新增course_selection
    await db.query("INSERT INTO course_selection (sid , cid , name) VALUES (? , ? , ?)" , [sid , cid , courseInfo.name] , err => {

        if(err) {

            console.log(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});
        }
    });

    //更新course
    await db.query("UPDATE course SET current_quantity = ? WHERE cid = ?" , [courseInfo.current_quantity + 1 , cid] , err => {

        if(err) {

            console.log(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});
        }
    });

    //更新students
    await db.query("UPDATE students SET credit = ? WHERE sid = ?" , [studentInfo.credit + courseInfo.credit , sid] , err => {

        if(err) {

            console.log(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});
        }
    });

    //整理課表
    var timeTable = await db.query("SELECT * FROM course_timetable WHERE cid = ?" , [cid] , err => {

        if(err) {

            console.log(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});
        }
    });

    //新增課表
    for(var i = 0 ; i < timeTable.length ; i++) {

        await db.query("INSERT INTO student_timetable (sid , cid , timeid , name) VALUES (? , ? , ? , ?)" , [sid , cid , timeTable.timeid , courseInfo.name] , err => {

            if(err) {

                console.log(err.message);
                res.status(500).json({msg: "伺服器內部錯誤"});
            }
        });
    }

    res.json({msg: "加選成功"});
});

module.exports = router;