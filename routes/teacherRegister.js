var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('./connect');

router.post('/' , (req , res) =>{

    var tid = req.body.tid;

    db.query("SELECT * FROM teachers WHERE tid = ?" , [tid] , (err , data) => {

        if(err){

            console.error(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});

        } else if(data.length !== 0) {

            res.json({msg: "帳號已存在"});
        }
    })

    var name = req.body.name;
    var dept = req.body.dept;
    var password = req.body.password;
    var hashPassword = bcrypt.hashSync(password , 10);

    db.query("INSERT INTO teachers VALUES (? , ? , ? , ? )" , [tid , name , dept  , hashPassword] , err => {

        if(err) {

            console.error(err.message);
            res.status(500).json({msg: "伺服器內部錯誤"});

        } else {

            res.json({msg: "註冊成功"});
        }
    })
});

module.exports = router;