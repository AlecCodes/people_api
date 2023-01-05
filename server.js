require('dotenv').config();
const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")


const {PORT = 3000, DATABASE_URL} = process.env 


//MIDDLEWARE
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())


////////////////////////////////////////////////////////////////
//MONGOOSE CONNECTION
////////////////////////////////////////////////////////////////
const mongoose = require('mongoose')

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error))



////////////////////////////////////////////////////////////////
//Schema
////////////////////////////////////////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})
//Document object
const People = mongoose.model('People', PeopleSchema)


////////////////////////////////////////////////////////////////
//ROUTES
////////////////////////////////////////////////////////////////
app.get("/", (req,res)=>{
    res.json({message: "Hello World"})
})

//index route
app.get("/people/", async (req,res) => {
    try{
        res.json(await People.find({}))
    } catch (error){
        res.status(400).json(error)
    }
})
//post route
app.post('/people', async (req,res) =>{
    try{
        res.json(await People.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
})
//PUT Route
app.put("/people/:id", async (req,res)=>{
    try{
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    }catch(error){
        res.status(400).json(error)
    }
})

//DELETE route
app.delete("/people/:id", async (req,res) => {
    try{
        res.json(await People.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

//Show route
app.get("/people/:id", async (req,res) => {
    try{
        res.json(await People.findById(req.params.id))
    } catch(error){
        res.status(400).json(error)
    }
})

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))