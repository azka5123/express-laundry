const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParse = require('body-parser');
const routes = require('./routes');
const moment = require('moment-timezone');


const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';


dotenv.config({path: envFile});

// console.log(process.env.NODE_ENV);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParse.json());
app.use(express.urlencoded({extended: true}));

app.use('/',routes);

app.get('/',(req,res)=>{
    waktu = moment().toDate();
    res.status(201).json({msg:'api untuk laundry' ,waktu});
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

module.exports = app;