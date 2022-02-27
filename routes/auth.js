const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const { newUserReqValidation } = require("../middleWare/dataValidation");
const { mailOption } = require("../utility/sendEmail");

const verificationURL = process.env.VERIFY_URL;



router.post("/register", newUserReqValidation, async(req, res) => {

    try {

        const newUser = new User({
            name: req.body.name,
            company: req.body.company,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASS).toString(),
        });

        const savedUser = await newUser.save();

        await mailOption({
			email: req.body.email,
			type: "verify-new-user",
			verificationLink: verificationURL + savedUser._id + "/" + savedUser.name,
		});
        
        res.json({ status: "success", message: "New user created", savedUser });
    }
    catch(error) {
        console.log(error);

        let message = "Unable to create new user at the moment, Please try agin or contact administration!";
        if (error.message.includes("duplicate key error collection")) {
            message = `User with the mail already exist or the email is invalid`;
        }
        res.json({ status: "error", message });
    }

    
})

router.post("/login", async(req, res) => {

    const { email, password } = req.body;

    if( !email || !password){
        res.json({ status:"error", message:"All fields are mandatory" });
    }

    try {

        const user = await User.findOne({ email });
        
        if(!user) return res.json({ status:"error", message:"username or password is incorrect!!!" });

        const id = user._id;

        const cryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASS);

        const userPassword = cryptedPassword.toString(CryptoJS.enc.Utf8);

        if(userPassword !== req.body.password) return  res.json({ status:"error", message:"username or password is incorrect!!!" });

        if (!user.isVerified) {
            return res.json({
                status: "error",
                message:
                    "You account has not been verified. Please check your email and verify you account before able to login!",
            });
        }

        const accessToken = jwt.sign(
            {
                id: user._id, 
                company: user.company,
            },
             process.env.SECRET_KEY,
             {expiresIn: "60min"}
        );

        const refreshToken = jwt.sign(
            {
                id: user._id, 
                company: user.company,
                name: user.name,
            },
             process.env.SECRET_KEY,
             {expiresIn: "30d"}
        );


        const { password, ...other } = user._doc;

        res.json({
            status: "success",
            message: "Login Successfully!",
            accessToken,
        });

    } 
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }


})

module.exports = router;