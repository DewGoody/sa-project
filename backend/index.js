const axios = require('axios')
const express = require('express')
const cors = require('cors');
const db = require('./db');
const {createPdfUsingAccForm} = require('./models/accForm')


const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.post('/api/create', (req, res, next) => {
    let data = req.body

    createPdfUsingAccForm(data)
    
    db.query("INSERT INTO user VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [data.id, data.name, data.faculty, data.phone, data.desAcc, data.email, data.desInj, data.dateAcc, data.placeAcc, data.placeTreat, data.typeHos, data.medicalFeeNum, data.bankAcc, data.medicalFeeText],(err, result) => {
        if(err){
            console.log(err);
        }
    })

    res.status(200).send({
        msg: "ok"
    })
});

app.get('/api', (req, res, next) => {
    res.status(200).send({
        msg: "ok from server!"
    })
});

app.get('/api/cunex', (req, res, next) => {
    const headers = {
        'Content-Type': 'application/json',
        'ClientId': 'cuserv',
        'ClientSecret': '25a4b9d2efb6b16cc75ed6786c92526c'
    }
    let params = req.query
    let url = 'https://cunexdev.azurewebsites.net/service.svc/ext/type3/profile'
    axios.get(url,{params : params, headers : headers}).then(response => {
        res.status(200).send({
            data : response.data
        })
    })
    
});

app.listen(1337, () => console.log("Server is running at port 1337"))

// {
//     "id":"1",
//     "name":"kuy",
//     "faculty":"sus",
//     "phone":"0",
//     "desAcc":"1",
//     "email":"kwqh",
//     "desInj":"qwe",
//     "dateAcc":"asedwqe",
//     "placeAcc":"alwkd",
//     "placeTreat":"sdfqwf",
//     "typeHos":"akdj",
//     "medicalFeeNum":"aefaef",
//     "bankAcc":"awdlk",
//     "medicalFeeText":"aekfj"
// }