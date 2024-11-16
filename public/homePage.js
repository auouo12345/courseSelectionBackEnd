async function timetableHandler() {

    // for(let i = 1 ; i <= 70 ; i++) {
    //
    //     document.getElementById(String(i)).innerText = '';
    // }

    let res = await fetch("http://localhost:4000/api/studentTimetable" , {
        method: "GET",
        credentials: 'include'
    });

    let result = await res.json();

    // for(let i = 0 ; i < result.length ; i++) {
    //
    //     document.getElementById(result[i].timeid + 1).innerText = result[i].cname;
    // }

    document.getElementsByClassName("selected-courses")[0].replaceChildren();

    res = await fetch("http://localhost:4000/api/getFocusList" , {
        method: "GET",
        credentials: 'include'
    });

    result = await res.json();

    for(let i = 0 ; i < result.length ; i++) {

        let cid = result[i].cid;
        let cname = result[i].cname;

        let li = document.createElement("li");

        let btn = document.createElement("button");
        btn.className = "classbtn";
        btn.setAttribute("data-bs-toggle" , "modal");
        btn.setAttribute("data-bs-target" , "#courseModal");
        let res = await fetch("http://localhost:4000/api/courseTimetable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "cid": cid
            }),
            credentials: 'include'
        });

        let week = ["星期一" , "星期二" , "星期三" , "星期四" , "星期五"]
        let timetable = res.json();
        let dataStr = cname;

        for(let j = 0 ; j < timetable.length ; j++) {

            dataStr += "<br>";
            dataStr += week[Math.floor(timetable[i].timeid / 14)] + ` 第${timetable[j].timeid % 14 + 1}節`;
        }

        console.log(dataStr)

        btn.setAttribute("data-course" , dataStr);
        btn.setAttribute("selectTarget" , cid)
        btn.innerHTML = dataStr;

        li.appendChild(btn);
        document.getElementsByClassName("selected-courses")[0].appendChild(li);
    }
}

timetableHandler();

document.getElementById('searchForm').addEventListener('submit' , async e => {

    e.preventDefault();
    let form = e.target;
    let resultPage = document.getElementsByClassName('course-list-scrollbar')[0];
    let body = {
        "pattern": form.elements.pattern.value,
        "week": [],
        "liberal": undefined,
        "elective": undefined
    };

    if(form.elements.Monday.checked) body.week.push(0);
    if(form.elements.Tuesday.checked) body.week.push(1);
    if(form.elements.wednesday.checked) body.week.push(2);
    if(form.elements.thursday.checked) body.week.push(3);
    if(form.elements.friday.checked) body.week.push(4);
    if(form.elements.liberalStudies.checked) body.liberal = true;
    if(form.elements.electiveSubject.checked) body.elective = true;

    let res = await fetch("http://localhost:4000/api/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body),
        credentials: 'include'
    })

    let result = await res.json();
    resultPage.innerHTML = "";

    for(let i = 0 ; i < result.length ; i++) {

        let cid = result[i].cid
        let name = result[i].name;

        let courseItem = document.createElement("div");
        courseItem.className = "course-item";

        let cidP = document.createElement("p");
        cidP.innerText = cid;
        courseItem.appendChild(cidP);

        let nameP = document.createElement("p");
        nameP.innerHTML = "<strong>" + name + "</strong>";
        courseItem.appendChild(nameP);

        let res = await fetch("http://localhost:4000/api/courseTimetable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "cid": cid
            }),
            credentials: 'include'
        });

        let week = ["星期一" , "星期二" , "星期三" , "星期四" , "星期五"];
        let timetable = await res.json();

        if(timetable.length !== 0) {

            let dayP = document.createElement("p");
            dayP.innerHTML += week[Math.floor(timetable[0].timeid / 14)] + ` 第${timetable[0].timeid % 14 + 1}節`;

            for(let j = 1 ; j < timetable.length ; j++) {

                dayP.innerHTML += "<br>";
                dayP.innerHTML += week[Math.floor(timetable[j].timeid / 14)] + ` 第${timetable[j].timeid % 14 + 1}節`;
            }

            courseItem.appendChild(dayP);
        }

        //新增按鈕
        let btn = document.createElement("button");
        btn.className = "add-course-button";
        btn.innerText = "關注";
        courseItem.appendChild(btn);
        btn.addEventListener('click' , async e => {

            let res = await fetch("http://localhost:4000/api/addFocus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "cid": cid
                }),
                credentials: 'include'
            });

            let result = await res.json();
            alert(result.msg);
            await timetableHandler();
        })

        resultPage.appendChild(courseItem);
    }
})

document.getElementById("logout").addEventListener('click' , async e => {

    let res = await fetch("http://localhost:4000/api/logout", {
        method: "GET",
        credentials: 'include'
    });

    let result = await res.json();
    alert(result.msg);
    window.location.href = 'index.html';
})
//loading animation #Ian
document.addEventListener("DOMContentLoaded", () => {
  const fadeInElements = document.querySelectorAll(".fade-in");

  // 逐一添加淡入效果
  fadeInElements.forEach((element, index) => {
      setTimeout(() => {
          element.classList.add("show");
      }, index * 300); // 每個部件延遲300ms
  });
});
//info update #Ian
document.addEventListener("DOMContentLoaded", function () {
  // 判斷用戶角色
  fetch('/api/getUserRole', {
      method: 'GET',
      credentials: 'include', // 附帶 session cookie
  })
      .then((response) => {
          if (!response.ok) {
              throw new Error('無法獲取用戶角色');
          }
          return response.json();
      })
      .then((userData) => {
          if (userData.role === 'teacher') {
              // 調用教師 API
              loadPersonalInfo('/api/getTeacherInfo', '教師編號', '所屬部門');
          } else if (userData.role === 'student') {
              // 調用學生 API
              loadPersonalInfo('/api/getSudentInfo', '學號', '科系');
          } else {
              alert('未知角色，請聯繫管理員');
          }
      })
      .catch((err) => {
          console.error('獲取用戶角色失敗:', err);
      });

  // 加載個人資訊函數
  function loadPersonalInfo(apiUrl, idLabel, deptLabel) {
      fetch(apiUrl, {
          method: 'GET',
          credentials: 'include',
      })
          .then((response) => {
              if (!response.ok) {
                  throw new Error('無法獲取個人資訊');
              }
              return response.json();
          })
          .then((data) => {
              if (data.msg) {
                  alert(data.msg); // 提示錯誤信息
                  return;
              }

              // 更新 Personal Info 區塊
              document.querySelector('.personal-info').innerHTML = `
                  <h2>個人資訊</h2>
                  <p>姓名: ${data.name}</p>
                  <p>${idLabel}: ${data.id}</p>
                  <p>${deptLabel}: ${data.dept}</p>
                  <div class="logoutButton">
                      <a id="logout" class="logout">登出</a>
                  </div>
              `;

              // 綁定登出按鈕邏輯
              bindLogout();
          })
          .catch((err) => {
              console.error('無法獲取個人資訊:', err);
          });
  }

  // 登出按鈕邏輯
  function bindLogout() {
      document.querySelector('#logout').addEventListener('click', function () {
          fetch('/api/logout', { method: 'POST', credentials: 'include' })
              .then(() => {
                  window.location.href = 'index.html'; // 返回登入頁
              })
              .catch((err) => console.error('登出失敗:', err));
      });
  }
});

