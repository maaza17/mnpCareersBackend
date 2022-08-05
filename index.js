const express = require('express')
const mongoose = require('mongoose')
const compression = require('compression')
const bodyParser = require('body-parser')
require("dotenv").config();

const jobListing = require('./routes/jobListing')
const jobApplication = require('./routes/jobApplication')
const adminRoute = require('./routes/admin/admin')
const employeeRoute = require('./routes/employee')

const app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb'}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(compression({
  level: 6,
  threshold: 0
}))
 
mongoose
  .connect(
    process.env.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log(err));

app.use('/api/admin', adminRoute)
app.use('/api/listings', jobListing)
app.use('/api/applications', jobApplication)
app.use('/api/employees', employeeRoute)

const port = process.env.PORT || 7000;

app.listen(port,  () => {
    console.log('Server running on port ' + port)

})