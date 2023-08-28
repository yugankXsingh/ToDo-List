import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

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

////////////////////////////////////////////////////////////// GETTING ACTIVITY FOR THE DAY /////////////////////////////////////////////////////
var newActivity = "";
var errorMessage = [];
app.post("/", async (req, res) => {
    // console.log(req.body);
    var activityType = req.body["type"];
    var players = req.body["participants"];

    try {
        const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${activityType}&participants=${players}`);
        const result = response.data;
        errorMessage = [];
        // console.log(result);
        newActivity = result[Math.floor(Math.random() * result.length)]
    } catch (error) {
        console.error("Failed to make request:", error.message);
        errorMessage.push("Oops! No activities that match your criteria. 😓😓")
    }

    res.redirect("/");
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var TaskList = ["Repeat", "Code", "Eat"];
var Count = 3;
var completedTaskList = [];


app.get("/", (req, res) => {
    // console.log(TaskList.length);
    // console.log(errorMessage.length);
    res.render("index.ejs", {
        Tasks: TaskList.reverse(),
        completedTasks: completedTaskList,
        dayType: today,
        advice: advice,
        TaskCount: Count,
        somethingToDo: newActivity,
        error: errorMessage
    })
});

app.post("/addTask", (req, res) => {
    let UserInputTask = req.body["NewTask"];

    if (UserInputTask.length !== 0 && UserInputTask[0] !== ' ') {
        TaskList.push(UserInputTask);
        Count++;
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
    TaskList.reverse();
    Count--;

    res.redirect("/");
})

app.post("/resetList", (req, res) => {
    completedTaskList = [];
    TaskList = ["Repeat", "Code", "Eat"];
    Count = 3;
    errorMessage = [];
    newActivity = "";
    res.redirect("/");
})


app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
});