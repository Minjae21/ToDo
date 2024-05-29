const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");
const addEventSubmit = document.querySelector(".add-event-btn");


let today = new Date();
let activeDay;
let month = today.getMonth();
let year=  today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// default events array
// const eventsArr = [
//     {
//         day: 29,
//         month: 5,
//         year: 2024,
//         events: [
//             {
//                 title: "ABC",
//                 time: "10:00AM",
//             },
//             {
//                 title: "ABC2",
//                 time: "12:00PM",
//             },
//         ],
//     },
//     {
//         day: 31,
//         month: 5,
//         year: 2024,
//         events: [
//             {
//                 title: "ABC",
//                 time: "10:00AM",
//             },
//         ],
//     },
// ];

// setting an empty array, then call get
let eventsArr = [];
getEvents();

// adding days
function initCalendar() {
    // a few prev and next month days and curr month days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    // calculate as the number of days required to fill up the row after
    // the last day of the curr month
    const nextDays = 7 - ((lastDate + day) % 7);

    // updating date on top
    date.innerHTML = months[month] + " " + year;

    // adding days
    let days = "";

    // prev month days
    for(let x = day; x > 0; x--) {
        days += `<div class = "day prev-date" >${prevDays - x + 1}</div>`;
    }

    // curr month days
    for(let i = 1; i <= lastDate; i++) {

        // checking if event found on curr day
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                // if found
                event = true;
            }
        });

        // if today, adding class today
        if(i === new Date().getDate() &&
        year === new Date().getFullYear() &&
        month === new Date().getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);

            // if even found, also add event class
            if(event) {
                days += `<div class = "day today active event" >${i}</div>`;
            }
            else {
                days += `<div class = "day today" >${i}</div>`;
            }
        }

        // adding rem days
        else {
            if(event) {
                days += `<div class = "day event" >${i}</div>`;
            }
            else {
                days += `<div class = "day " >${i}</div>`;
            }
        }
    }

    // next month days
    for(let j = 1; j <= nextDays; j++) {
        days += `<div class = "day next-date " >${j}</div>`;
    }

    daysContainer.innerHTML = days;

    // add listener after calendar initialized
    addListener();
}

initCalendar();

// prev months
function prevMonth() {
    month--;
    if(month < 0) {
        month < 11;
        year--;
    }
    initCalendar();
}

// next months
function nextMonth() {
    month++;
    if(month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

// adding evenListener on prev and next months
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// adding goto date/today
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input", (e) => {
    // allowing only numbers
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if(dateInput.value.length === 2) {
        // adding a slash after month
        dateInput.value += '/';
    }
    if(dateInput.value.length > 7) {
        // allowing only up to 7 numbers
        dateInput.value = dateInput.value.slice(0, 7);
    }

    // if backspace
    if(e.inputType === "deleteContentBackward") {
        if(dateInput.value.length === 3) {
            dateInput.value = dateInput.value.slice(0, 2);
        }
    }
});

gotoBtn.addEventListener("click", gotoDate);

// go to btn function
function gotoDate() {
    const dateArr = dateInput.value.split("/");
    // date validation
    if(dateArr.length === 2) {
        if(dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }

    // if invalid
    alert("Invalid date");
}

// adding events
const addEventBtn = document.querySelector(".add-event");
const addEventContainer = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");
const addEventTitle = document.querySelector(".event-name");
const addEventFrom = document.querySelector(".event-time-from");
const addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
    // if click outside
    if(e.target != addEventBtn && !addEventContainer.contains(e.target)) {
        addEventContainer.classList.remove("active");
    }
});

// only allowing 50 chars in title
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 50);
});

// time format
addEventFrom.addEventListener("input", (e) => {
    // removing anything else but numbers
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    // add : after two nums
    if(addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }
    // no more than 5 chars
    if(addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
});


addEventTo.addEventListener("input", (e) => {
    // removing anything else but numbers
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    // add : after two nums
    if(addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }
    // no more than 5 chars
    if(addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
});

// adding listener on days after rendered
function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            // setting curr day as active day
            activeDay = Number(e.target.innerHTML);

            // calling active day after click
            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));

            // removing active from already existing active
            days.forEach((day) => {
                day.classList.remove("active");
            });
            // if prev month days clicked, goto prev month and add active
            if(e.target.classList.contains("prev-date")) {
                prevMonth();

                // setTimeout(() => {
                //     const days = document.querySelectorAll(".day");

                //     days.forEach((day) => {
                //         if(
                //             !day.classList.contains("prev-date") &&
                //             day.innerHTML === e.target.innerHTML
                //         ) {
                //             day.classList.add("active");
                //         }
                //     });
                // }, 100);
            } else if(e.target.classList.contains("next-date")) {
                nextMonth(); // same func, next month
            } else {
                // remains curr month
                e.target.classList.add("active");
            }
        });
    });
}

// show active day events and date at top
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}

// func to show events on curr day
function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        // get events of active day
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            event.events.forEach((event) => {
                events += `
                <div class = "event">
                    <div class = "title">
                        <i class = "fas fa-circle"></i>
                        <h3 class = "event-title">${event.title}</h3>
                        </div>
                        <div class = "event-time">
                            <span class = "event-time">${event.time}</span>
                        </div>
                    </div>
                `;
            });
        }
    });

    // if nothing found
    if(events === "") {
        events = `<div class = "no-event">
                    <h3>No Events</h3>
                </div>`;
    }
    eventsContainer.innerHTML = events;

    // save events when added
    saveEvents();
}

// adding events func
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    if(eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill out the fields!");
        return;
    }

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    if (
        timeFromArr.length != 2 ||
        timeToArr.length != 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert("Invalid Time Format");
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
    };

    let eventAdded = false;

    // check if eventArr not empty
    if(eventsArr.length > 0) {
        // check if curr day already has an event then add
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    // if event array empty or curr day has no event, create new
    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }

    // remove active from add event form
    addEventContainer.classList.remove("active");
    // clear the fields
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";

    // show curr added events
    updateEvents(activeDay);

    // add event class to newly added day
    const activeDayElem = document.querySelector(".day.active");
    if(!activeDayElem.classList.contains("event")) {
        activeDayElem.classList.add("event");
    }
});

function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}

// remove events
eventsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("event")) {
        if (confirm("Are you sure you want to delete this event?")) {
            const eventTitle = e.target.querySelector(".event-title").innerHTML;

            for (let i = 0; i < eventsArr.length; i++) {
                let event = eventsArr[i];
                if (
                    event.day === activeDay &&
                    event.month === month + 1 &&
                    event.year === year
                ) {
                    for (let j = 0; j < event.events.length; j++) {
                        if(event.events[j].title === eventTitle) {
                            event.events.splice(j, 1);
                            break;
                        }
                    }

                    // if nothing left, remove event class
                    if(event.events.length === 0) {
                        eventsArr.splice(i, 1);

                        const activeDayElem = document.querySelector(".day.active");
                        if(activeDayElem && activeDayElem.classList.contains("event")) {
                            activeDayElem.classList.remove("event");
                        }
                    }
                    break;
                }
            }
            // after removing events, update
            updateEvents(activeDay);
        }
    }
});


// store events in local storage, get from there
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
    if(localStorage.getItem("events" === null)) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}