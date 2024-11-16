var express = require('express');
var router = express.Router();
var db = require('./connect');

// 使用Promise包裝query
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

    // 檢查是否已經關注過
    try {
        let data = await queryAsync("SELECT * FROM attention WHERE sid = ? AND cid = ?", [sid, cid]);
        if (data.length !== 0) {
            return res.json({ msg: "已經關注該課程" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ msg: "伺服器內部錯誤" });
    }

    // 從資料庫查詢課程名稱
    let courseInfo;

    try {

        let data = await queryAsync("SELECT * FROM course WHERE cid = ?" , [cid]);

        if(data.length === 0) {

            return res.json({msg: "課程不存在"});

        } else {

            courseInfo = data[0];
        }
    } catch (err) {

        console.log(err.message);
        return res.status(500).json({msg: "伺服器內部錯誤"});
    }

    // 新增關注記錄
    try {
        await queryAsync("INSERT INTO attention (sid, cid, cname) VALUES (?, ?, ?)", [sid, cid, courseInfo.name]);
        return res.json({ msg: "關注成功" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ msg: "伺服器內部錯誤" });
    }
});

module.exports = router;