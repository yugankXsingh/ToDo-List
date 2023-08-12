import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/////////////////////////////////////////////////// GIVING ADVICE FOR THE DAY ///////////////////////////////////////////////////////////////// 

const d = new Date();
const day = d.getDay();

var today = "";
var advice = "";

if (day === 6 || day === 0) {
    today = "the weekend";
    advice = "it's time to fun!"
} else {
    today = "a weekday";
    advice = "it's time to Work hard!"
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var TaskList = ["Eat", "Code", "Repeat"];
var completedTaskList = [];


app.get("/", (req, res) => {
    // console.log(TaskList);
    res.render("index.ejs", {
        Tasks: TaskList,
        completedTasks: completedTaskList,
        dayType: today,
        advice: advice
    })
});

app.post("/addTask", (req, res) => {
    let UserInputTask = req.body["NewTask"];

    if (UserInputTask.length !== 0 && UserInputTask[0] !== ' ') {
        TaskList.push(UserInputTask);
    }
    res.redirect("/");
})

app.post("/completed", (req, res) => {
    var doneTask = req.body["doneTask"];
    // console.log(doneTask);

    completedTaskList.push(doneTask);


    let doneTaskIndex = TaskList.indexOf(doneTask);
    // remove this doneTask from TaskList array
    TaskList.splice(doneTaskIndex, 1);

    res.redirect("/");
})

app.post("/resetList", (req, res) => {
    completedTaskList = [];
    TaskList = ["Eat", "Code", "Repeat"];
    res.redirect("/");
})


app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
});