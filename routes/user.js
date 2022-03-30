const express = require("express");
const router = express.Router();
const verifyToken = require("../middleWare/verifyAccessToken");
const User = require("../models/user");
const ResetPin = require("../models/resetPassword");
const randomPin = require("../utility/randomPinGenerator");
const { mailOption } = require("../utility/sendEmail");
const CryptoJS = require("crypto-js");
const { resetPassReqEmailValidation, updatePasswordReqValidation } = require("../middleWare/dataValidation");

router.get("/", verifyToken, async(req,res) => {

    const _id = req.user.id;

    try {

        const user = await User.findById({_id});

        const {password, isVerified, ...other} = user._doc;
        
        res.status(200).send(other);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.patch("/verify", async (req, res) => {
	try {
		const { _id, name } = req.body;

        console.log(_id);

		const result = await User.findOneAndUpdate({ _id, name, isVerified: false }, {$set: { isVerified: true }}, { new: true });

        console.log(result);

		if (result && result._id) {
			return res.json({
				status: "success",
				message: "You account has been activated, you may sign in now.",
			});
		}

		return res.json({
			status: "error",
			message: "Invalid request!",
		});
	} catch (error) {
		console.log(error);
		return res.json({
			status: "error",
			message: "Invalid request!",
		});
	}
});

router.post("/reset-password", resetPassReqEmailValidation, async(req, res) => {

    try{

        const user = await User.findOne({ email:req.body.email });
    
        if(user && user._id){

            let newResetPin = await ResetPin.findOne({ email: req.body.email});

            if(!newResetPin){

                const pin = await randomPin(6);

                newResetPin = new ResetPin({
                    email: user.email,
                    pin: pin
                });
        
                const resetPin = await newResetPin.save();
            }
    
            await mailOption({ email:user.email, pin:newResetPin.pin, type:"request-new-password" });
    
    
            return 	res.json({
                status: "success",
                message:
                `Check your registerd email inbox for the password reset pin. If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address..`
            });
    
        }
    
        return 	res.json({
            status: "success",
            message:
            `Check your registerd email inbox for the password reset pin. If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address..`
        });
    }
    catch(error) {
        console.log(error)
        res.status(500).send(err0r);
    }



})

router.patch("/reset-password", updatePasswordReqValidation, async(req, res) => {

    try{

        const getResetPin = await ResetPin.findOne({email: req.body.email});

    
        if(getResetPin._id){

            const createdDate = getResetPin.addedAt;
            const expiresIn = 1;
    
            let expDate = createdDate.setDate(createdDate.getDate() + expiresIn)
    
            const today = new Date();
    
            if (today > expDate) {
                return res.json({ status: "error", message: "Invalid or expired pin." });
            }
    
            const password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASS).toString();
            const updateUserPassword = await User.findOneAndUpdate({email: req.body.email }, { $set: { password: password}}, {new: true});

    
            if(updateUserPassword._id){
    
                const result = await mailOption({ email: updateUserPassword.email, type: "password-update-success" });

                //console.log(result);

                await ResetPin.findOneAndDelete({email: req.body.email}, {pin: req.body.pin});

                return res.json({
                    status: "success",
                    message: "Your password has been updated",
                });
    
            }
    
        }

        return res.json({
            status: "error",
            message: "Unable to update your password. plz try again later",
        });

    } catch(err){
        res.status(599).send(err);
    }


})

module.exports = router;