document.addEventListener('DOMContentLoaded', function () {
  // 加載教師個人資訊
  fetch('/api/getTeacherInfo', { method: 'GET', credentials: 'include' })
    .then((response) => {
        if (response.status === 401) {
            alert('未登入或會話已過期，請重新登入');
            return null; // 提前結束
        }
        if (response.status === 404) {
            alert('教師資訊不存在');
            return null; // 提前結束
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log('回傳的資料:', data); // 確認 data.tid 是否正確
        console.log(data.tid);
        let tid = data.tid;

        if (!data.tid) {
          console.error('tid 未定義！');
        }
        if (!data) return; // 如果前面已經處理了錯誤，這裡不再繼續執行

        const personalInfoDiv = document.querySelector('.personal-info');
        if (!personalInfoDiv) {
            console.error('無法找到 .personal-info 元素');
            return;
        }
        

        personalInfoDiv.innerHTML = 
            "<h2>個人資訊</h2>" +
            "<p>姓名:" + data.name + "</p>" +
            "<p>教師編號:" + data.tid + "</p>" +
            "<p>所屬:" + data.dept + "</p>" +
            "<div class='logoutButton'>" + 
                "<a id='logout' class='logout'>登出</a>" +
            "</div>"
        ;

        document.querySelector('#logout').addEventListener('click', function () {
            fetch('/api/logout', { method: 'GET', credentials: 'include' })
                .then(async (res) => {
                    let result = await res.json();
                    alert(result.msg);
                    window.location.href = 'index.html';
                })
                .catch((err) => console.error('登出失敗:', err));
        });
    })
    .catch((err) => {
        console.error('無法獲取教師資訊:', err);
        alert('獲取教師資訊失敗，請稍後再試');
    });
})

async function teacherPageHandler() {
    //更新右側課表
    for(let i = 0 ; i < 70 ; i++) {

        document.getElementById(i).innerText = '';
        document.getElementById(i).style.backgroundColor = 'white';
    }

    let res = await fetch("/api/teacherTimetable" , {
        method: "GET",
        credentials: 'include'
    });

    let result = await res.json();

    for(let i = 0 ; i < result.length ; i++) {

        let target = document.getElementById(result[i].timeid);
<<<<<<< Updated upstream

        if(target.innerText !== '') {

            target.innerText += '\n'
        }

        target.innerText += result[i].cname;
        target.style.backgroundColor = "green";
=======
        target.innerText = result[i].cname;
        target.style.backgroundColor = "#b4d9ef";
>>>>>>> Stashed changes
    }


    res = await fetch('/api/getTeacherCourses' , {
        method: 'GET',
        credentials: 'include'
    })

    result = await res.json();
    let courseList = document.getElementsByClassName("course-list-scrollbar")[0];
    courseList.replaceChildren();

    for(let i = 0 ; i < result.length ; i++) {

        let courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.innerHTML = `<p>${result[i].cid}</p>
                              <p><strong>${result[i].name}</strong></p>
                              <button class="edit-button" data-bs-toggle="modal" data-bs-target="#courseModal" data-course="${result[i].name}" selectTarget = "${result[i].cid}">編輯</button>`;

        courseList.appendChild(courseItem);
    }
}

let selectedTimes = []; // 用來存儲已選擇的課程時段

function selectTime(button , timeid) {
    //const timeSlot = `${day} ${time}`; // 唯一標識時段

    // 如果已選擇，再次點擊則取消選擇
    if (selectedTimes.includes(timeid)) {
        selectedTimes = selectedTimes.filter(slot => slot !== timeid); // 移除已選擇的時段
        button.classList.remove("selected");
        button.classList.add("unselected");
    } else {
        // 如果尚未選擇，則新增到已選列表
        selectedTimes.push(timeid);
        button.classList.add("selected");
        button.classList.remove("unselected");
    }

    console.log("已選時段:", selectedTimes); // 用於除錯
}

document.getElementById('saveChangesButton').addEventListener('click' , async e => {

    e.preventDefault();
    let form = document.getElementById('editForm');
    let body = {
        'cid': selectTarget,
        'name': document.getElementById('courseNameInput').value,
        'timetable': selectedTimes,
        'classRoom': document.getElementById('courseLocationInput').value
    }

    let res = await fetch("http://localhost:4000/api/updateCourseInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body),
        credentials: 'include'
    })

    let result = await res.json();

    await teacherPageHandler();
    var modal = bootstrap.Modal.getInstance(courseModal);
    modal.hide();
    alert(result.msg);
})

teacherPageHandler();
