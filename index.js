const path=require('path')
const express=require('express')
const mongoose=require('mongoose');
const userRoute=require('./routes/user')


const app=express();
const PORT=8001;

mongoose.connect('mongodb://localhost:27017/blogDb').then((e) => {
	console.log('Database Connected');
})

app.use(express.urlencoded({ extended: false }));


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


app.get('/', (req, res) => {
	res.render('home')
})

app.use('/user', userRoute)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
