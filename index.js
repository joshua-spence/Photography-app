const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { response } = require('express');


app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: 'josh',
    password: 'password',
    database: 'project'
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected!");
  });

//sends data from database to js file
app.get('/api', (req, res) => {
    db.query('SELECT town, postcode, lat, lng FROM location', (err, result) => {
        if(err) throw err;
        const db_coord = result;
        res.json({locations:db_coord});
    });
})

app.post('/add', (req, res) => {
    db.query(`INSERT INTO location (town, postcode, lat, lng) VALUES ('${req.body.town}', '${req.body.postcode}', ${req.body.lat}, ${req.body.lng});`, (err, result) =>  {
        if(err) throw err;
        console.log('success added to db!');
  });
});

app.listen(3000, () => {console.log('listening to port')});


