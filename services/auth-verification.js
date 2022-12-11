const jwt = require("jsonwebtoken")

function auth(req, res, next){
    // 1. Header token should be in the format: Bearer <TOKEN_VALUE>
    try{
        const tokenValue = req.header('auth-token').split(" ")[1]
        if(!tokenValue){
            return res.status(401).send({message: "Access denied! Header token is missing from request!"})
        }
        // 2. If token is present 
        try{
            const verified = jwt.verify(tokenValue, process.env.TOKEN_SECRET)
            req.user=verified
            next()
        }catch(err){
            return res.status(401).send({message: "Invalid Token! Please refresh token."})
        }
    }catch(error){
        return res.status(401).send({message: "Access denied! Header token is missing from request!"})
    }
}

module.exports=auth