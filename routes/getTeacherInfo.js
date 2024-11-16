// 引入 express 模組
var express = require('express');
var router = express.Router(); // 初始化 router
var db =  require('./connect'); // 根據你的專案結構正確引入資料庫模組

// 定義路由
router.get('/', (req, res) => {
  const tid = req.session.tid;
  console.log('收到 /getTeacherInfo 請求');
  console.log('Session tid:', tid);

  if (!tid) {
    console.warn('Session 中未找到 tid 可能用戶未登入或會話已過期');
    return res.status(401).json({ msg: '未登入或會話已過期' });
  }

  db.query(
    'SELECT name, tid, dept FROM teachers WHERE tid = ?',
    [tid],
    (err, data) => {
      if (err) {
        console.error('資料庫查詢失敗:', err.message);
        return res.status(500).json({ msg: '伺服器內部錯誤' });
      }
      if (data.length === 0) {
        console.warn('教師資訊不存在 tid:', tid);
        return res.status(404).json({ msg: '教師資訊不存在' });
      }

      console.log('成功查詢教師資訊:', data[0]);

      res.json(data[0]);
    }
  );
});

// 匯出 router
module.exports = router;
