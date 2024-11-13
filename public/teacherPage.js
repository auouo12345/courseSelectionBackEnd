// 存儲已選的時間段
let selectedTimes = [];

function selectTime(day, time) {
    const selected = `${day} ${time}`;
    if (!selectedTimes.includes(selected)) {
        selectedTimes.push(selected);
        alert(`已選擇：${selected}`);
        console.log("選擇的時間段：", selectedTimes);
        // 可以在這裡添加 AJAX 代碼將選擇的時間段發送到後端
    }
}
