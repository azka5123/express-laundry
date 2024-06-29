const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParse = require('body-parser');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger_output.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParse.json());
app.use(express.urlencoded({extended: true}));

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/',routes);

app.get('/',(req,res)=>{
    res.status(201).json({msg:'api untuk laundry'});
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

module.exports = app;