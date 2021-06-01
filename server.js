require("dotenv").config();
const express = require('express');
const db = require("./db") // accessing the db object

const morgan = require('morgan');

const app = express();
app.use(express.json())

app.use((req, res, next) => {
    console.log("middleware");
    next();
}) 

app.use(morgan("dev"))

// get all restuarants
app.get('/api/v1/restaurants', async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM restuarants");
        console.log(results)
        res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: {
            restaurants: results.rows
        }
    })
    } catch (error) {
        console.log(error)
    }
    
})
// get a restuarant
app.get('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM restuarants WHERE id = $1", [req.params.id]);
        console.log(results)
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        })
    } catch (error) {
        console.log(error)
    }
    
    console.log("restuarant id: " + req.params.id)
})

// Create a restuarant
app.post('/api/v1/restaurants', async (req, res) => {
    const {name, location, id, price_range} = req.body
    try {
        const results = await db.query("INSERT INTO restuarants (id, name, location, price_range) values ($1, $2, $3, $4) returning *", [id, name, location, price_range]);
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        })
    } catch (error) {
        console.log(error)
    }

})


const port = process.env.PORT || 4001; // PORT is the env variable defined in .env

app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})

