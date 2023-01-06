// const {expressjwt} = require('express-jwt');
const jwt = require('jsonwebtoken');

// exports.requireSignin = expressjwt({
//     secret: process.env.SECRET_KEY,
//     algorithms: ['HS256'],
//     userProperty: 'auth'
// });

exports.isAuth = async (req, res, next) => {
    const { cookies } = req;

    const data = jwt.verify(cookies.accessToken, process.env.SECRET_KEY);
    req.id = data._id;
    if(!req.id){
        return res.status(401).send({message: 'Not authorized.'})
    }

    next();
}