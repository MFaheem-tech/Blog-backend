const express=require("express");
const multer=require('multer')
const Blog=require("../models/blog")
const Comment=require("../models/comment")
const path=require('path')
const router=express.Router();

const storage=multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.resolve(`./public/uploads/`))
	},
	filename: function (req, file, cb) {
		const fileName=`${Date.now()}- ${file.originalname}`
		cb(null, fileName);
	}
});

const upload=multer({ storage: storage })

router.get('/add-new', (req, res) => {
	return res.render('addBlog', {
		user: req.user
	})
});
router.get('/:id', async (req, res) => {
	try {
		const blog=await Blog.findById(req.params.id).populate('createdBy')
		const comments=await Comment.find({ blogId: req.params.id }).populate('createdBy')
		return res.render('blog', {
			user: req.user,
			blog: blog,
			comments,
		})
	} catch (error) {
		console.log(error)
	}
});
router.post('/', upload.single("coverImage"), async (req, res) => {
	const { title, body }=req.body;
	const blog=await Blog.create({
		body,
		title,
		createdBy: req.user._id,
		coverImage: `/uploads/${req.file.filename}`
	})
	return res.redirect(`/blog/${blog._id}`)
});


router.post('/comment/:blogId', async (req, res) => {

	const comment=await Comment.create({
		content: req.body.content,
		blogId: req.params.blogId,
		createdBy: req.user._id,
	});
	return res.redirect(`/blog/${req.params.blogId}`);

})






module.exports=router;