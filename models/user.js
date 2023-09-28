const { Schema, model }=require('mongoose');
const { createHmac, randomBytes }=require("node:crypto");

const { createTokenForUser }=require('../utils/auth')

const userSchema=new Schema({
	fullName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	salt: {
		type: String,
	},
	password: {
		type: String,
		required: true
	},
	profile: {
		type: String,
		default: '/images/user.png'
	},
	role: {
		type: String,
		enum: ['USER', "ADMIN"],
		default: 'USER',
	}
}, { timestamps: true });


userSchema.pre('save', function (next) {
	const user=this;
	if (!user.isModified('password')) return;
	const salt="hereissaltvalue";
	const hashedPassword=createHmac("sha256", salt)
		.update(user.password)
		.digest("hex");
	this.salt=salt;
	this.password=hashedPassword;
	next();
});

userSchema.statics.matchPasswordAndReturnToken=async function (email, password) {
	const user=await this.findOne({ email });
	if (!user) {
		throw new Error("User not found with the given email");
	}
	const salt=user.salt;
	const hashedPassword=user.password;

	const providedPasswodHash=createHmac("sha256", salt).update(password).digest('hex');
	if (hashedPassword!==providedPasswodHash) {
		throw new Error("Password are not matched")
	}

	const token=createTokenForUser(user);
	return token;
}


const User=model('User', userSchema);
module.exports=User;