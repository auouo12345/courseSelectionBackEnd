async function timetableHandler() {

    for(let i = 1 ; i <= 70 ; i++) {

        document.getElementById(String(i)).innerText = '';
    }

    let res = await fetch("http://localhost:4000/api/studentTimetable" , {
        method: "GET",
        credentials: 'include'
    });

    let result = await res.json();
    console.log(result);

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

    for(let i = 0 ; i < result.length ; i++) {

        let courseItem = document.createElement("div");
        courseItem.className = "course-item";

        let cidP = document.createElement("p");
        cidP.innerText = result[i].cid;
        courseItem.appendChild(cidP);

        let nameP = document.createElement("p");
        nameP.innerHTML = "<strong>" + result[i].name + "</strong>";
        courseItem.appendChild(nameP);

        let btn = document.createElement("button");
        btn.className = "add-course-button";
        btn.innerText = "加選";
        courseItem.appendChild(btn);

        resultPage.appendChild(courseItem);
    }

    console.log(result);
})