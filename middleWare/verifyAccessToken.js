const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) =>{

    const authToken = req.headers.token;
    if(authToken){

        const token = authToken.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
            if(err){
                return res.status(403).send("Unauthorized Access!!!");
            }
            req.user = user;
            next();
        })

    }
    else{
        return res.status(401).send("You're not authorized to access !!!")
    }
};

module.exports = verifyToken;