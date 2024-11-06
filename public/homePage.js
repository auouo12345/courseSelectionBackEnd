async function timetableHandler() {

    for(let i = 1 ; i <= 70 ; i++) {

        document.getElementById(String(i)).innerText = '';
    }

    let res = await fetch("http://localhost:4000/api/studentTimetable" , {
        method: "GET",
        credentials: 'include'
    });

    let result = await res.json();

    for(let i = 0 ; i < result.length ; i++) {

        document.getElementById(result[i].timeid + 1).innerText = result[i].cname;
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

        let week = ["星期一" , "星期二" , "星期三" , "星期四" , "星期五"]
        let timetable = await res.json();

        if(timetable.length !== 0) {

            let dayP = document.createElement("p");
            dayP.innerHTML += week[Math.floor(timetable[0].timeid / 14)] + ` 第${timetable[0].timeid % 14 + 1}節`;

            for(let j = 1 ; j < timetable.length ; j++) {

                dayP.innerHTML += "<br>";
                dayP.innerHTML += week[Math.floor(timetable[i].timeid / 14)] + ` 第${timetable[j].timeid % 14 + 1}節`;
            }

            courseItem.appendChild(dayP);
        }

        //新增按鈕
        let btn = document.createElement("button");
        btn.className = "add-course-button";
        btn.innerText = "加選";
        courseItem.appendChild(btn);
        btn.addEventListener('click' , async e => {

            let res = await fetch("http://localhost:4000/api/courseAdd", {
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