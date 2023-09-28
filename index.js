const path=require('path')
const express=require('express')
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');

const Blog=require('./models/blog')
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const { checkForauthenticateCookie }=require('./middlewares/authentication');


const app=express();
const PORT=8001;

mongoose.connect('mongodb://localhost:27017/blogDb').then((e) => {
	console.log('Database Connected');
})

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(checkForauthenticateCookie('token'))

app.use(express.static(path.resolve('./public')))


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


app.get('/', async (req, res) => {

	const allBlog=await Blog.find({})
	res.render('home', {
		user: req.user,
		blogs: allBlog,
	})
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
