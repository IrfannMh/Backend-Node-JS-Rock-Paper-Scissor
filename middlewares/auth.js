const jwt = require("jsonwebtoken")
const {JWT_SIGNATURE_KEY = "SIGNATURE"} = process.env;

module.exports = function (req,res,next){
    try {
        const payload = jwt.verify(req.headers["authorization"], JWT_SIGNATURE_KEY);
        req.user = payload;
        next()
    } catch (error) {
        res.status(401).json({
            status: "FAIL",
            data: {
                user: "UNAUTHORIZED",
                message: err.message,
            },
        });      
    }
}