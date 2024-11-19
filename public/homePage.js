//更新頁面資訊
async function pageInfoHandler() {

    //更新右側課表
    for(let i = 0 ; i < 70 ; i++) {

        let oldDiv = document.getElementById(String(i))
        let newDiv = document.createElement('div');
        newDiv.setAttribute('id' , String(i));
        oldDiv.parentNode.replaceChild(newDiv, oldDiv);
    }

    let res = await fetch("http://localhost:4000/api/studentTimetable" , {
        method: "GET",
        credentials: 'include'
    });

    let result = await res.json();

    for(let i = 0 ; i < result.length ; i++) {

        let cid = result[i].cid;
        let target = document.getElementById(result[i].timeid);
        target.innerText = result[i].cname;
        target.style.backgroundColor = "green";
        target.addEventListener('click' , async e => {

            if(confirm('是否退選')) {

                let res = await fetch("http://localhost:4000/api/courseDrop", {
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
                pageInfoHandler();
            }
        })
    }

    //更新左下方關注列表
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
        let timetable = await res.json();
        let dataStr = cname;

        for(let j = 0 ; j < timetable.length ; j++) {

            let target = document.getElementById(timetable[j].timeid);
            target.style.backgroundColor = target.innerText === "" ? "yellow" : "red";
            target.innerText += '\n' + cname;

            dataStr += "<br>";
            dataStr += week[Math.floor(timetable[j].timeid / 14)] + ` 第${timetable[j].timeid % 14 + 1}節`;
        }

        dataStr += "</p>";
        btn.setAttribute("data-course" , dataStr);
        btn.setAttribute("selectTarget" , cid)
        btn.innerHTML = dataStr;

        li.appendChild(btn);
        document.getElementsByClassName("selected-courses")[0].appendChild(li);
    }

    //更新個人資訊
    res = await fetch("http://localhost:4000/api/getStudentInfo", {
        method: "GET",
        credentials: 'include'
    });

    result = await res.json();
    console.log(result);

    document.querySelector('#personal-info').innerHTML = `
       <h2>個人資訊</h2>
       <p>姓名: ${result.name}</p>
       <p>學號: ${result.sid}</p>
       <p>系所: ${result.dept}</p>
       <p>學分: ${result.credit}</p>
   `;
}

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
    resultPage.replaceChildren();

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
            await pageInfoHandler();
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
});

//loading animation #Ian
document.addEventListener("DOMContentLoaded", () => {
  const fadeInElements = document.querySelectorAll(".fade-in");

  // 逐一添加淡入效果
  fadeInElements.forEach((element, index) => {
      setTimeout(() => {
          element.classList.add("show");
      }, index * 300); // 每個部件延遲300ms
  });

  pageInfoHandler();
});

document.getElementById('courseAdd').addEventListener('click' , async e => {

    let res = await fetch("http://localhost:4000/api/courseAdd", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "cid": selectTarget
        }),
        credentials: 'include'
    });

    let result = await res.json();

    if(result.msg === "加選成功") {

        await fetch("http://localhost:4000/api/dropFocus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "cid": selectTarget
            }),
            credentials: 'include'
        });
    }

    alert(result.msg);
    pageInfoHandler();
})

document.getElementById('cancel').addEventListener('click' , async e=> {

    let res = await fetch("http://localhost:4000/api/dropFocus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "cid": selectTarget
        }),
        credentials: 'include'
    });

    let result = await res.json();
    alert(result.msg);
    pageInfoHandler();
});

async function courseDrop(cid) {

}

//info update #Ian
// document.addEventListener("DOMContentLoaded", function () {
//   // 判斷用戶角色
//   fetch('/api/getUserRole', {
//       method: 'GET',
//       credentials: 'include', // 附帶 session cookie
//   })
//       .then((response) => {
//           if (!response.ok) {
//               throw new Error('無法獲取用戶角色');
//           }
//           return response.json();
//       })
//       .then((userData) => {
//           if (userData.role === 'teacher') {
//               // 調用教師 API
//               loadPersonalInfo('/api/getTeacherInfo', '教師編號', '所屬部門');
//           } else if (userData.role === 'student') {
//               // 調用學生 API
//               loadPersonalInfo('/api/getStudentInfo', '學號', '科系');
//           } else {
//               alert('未知角色，請聯繫管理員');
//           }
//       })
//       .catch((err) => {
//           console.error('獲取用戶角色失敗:', err);
//       });
//
//   // 加載個人資訊函數
//   function loadPersonalInfo(apiUrl, idLabel, deptLabel) {
//       fetch(apiUrl, {
//           method: 'GET',
//           credentials: 'include',
//       })
//           .then((response) => {
//               if (!response.ok) {
//                   throw new Error('無法獲取個人資訊');
//               }
//               return response.json();
//           })
//           .then((data) => {
//               if (data.msg) {
//                   alert(data.msg); // 提示錯誤信息
//                   return;
//               }
//
//               console.log(data);
//
//               // 更新 Personal Info 區塊
//               document.querySelector('#personal-info').innerHTML = `
//                   <h2>個人資訊</h2>
//                   <p>姓名: ${data.name}</p>
//                   <p>${idLabel}: ${data.id}</p>
//                   <p>${deptLabel}: ${data.dept}</p>
//               `;
//
//           })
//           .catch((err) => {
//               console.error('無法獲取個人資訊:', err);
//           });
//   }
// });

