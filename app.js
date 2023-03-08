const express = require("express")
const bodyParser = require('body-parser')


const app = express()

const path = require('path');

app.use(express.static(path.join(__dirname, 'views')))
var hbs = require('hbs');
var fs = require("fs");
var axios = require('axios');

app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

hbs.registerHelper('isEqual', function (option, value) {
    return Number(value) === Number(option);
});

require('dotenv').config()

const emptyData = require('./empty.json')

app.get("/", (req, res) => {
    res.render('index')
})

app.post("/solve", (req, res) => {
    const model = fs.readFileSync("combined.essence", 'utf8');
    const data = {
        model: model,
        data: JSON.stringify(Object.assign(emptyData, JSON.parse(req.body.data))),
        solver: "minion",
        conjure_options: ["--number-of-solutions", "5"]
    }

    console.log(data.data);
    const url = 'https://demos.constraintmodelling.org/server/submit'

    axios
        .post(url, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })
        .then((response) => {
            // console.log(`Status: ${response.status}`);
            // console.log('Body: ', response.data);
            res.json(response.data);

        }).catch((err) => {
            console.error(err);
        });
})

app.get("/result", (req, res) => {
    res.render('result')
})

app.post("/getJob", (req, res) => {
    const data = {
        jobid: req.body.data
    }

    const url = 'https://demos.constraintmodelling.org/server/get'
    axios
        .post(url, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })
        .then((response) => {
            console.log(`Status: ${response.status}`);
            console.log('Body: ', response.data);
            res.json(response.data);
        }).catch((err) => {
            console.error(err);
        });
})


app.listen(5000)