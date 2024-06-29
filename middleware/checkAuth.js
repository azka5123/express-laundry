const { Token } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');


async function checkAuth(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'Access Denied' });
    }
    const checkTokenDatabase = await Token.findOne({ where: { token } });
    try {
        const check = jwt.verify(token, JWT_SECRET);
        if (!check || checkTokenDatabase.expiresAt < new Date()) {
            return res.status(400).json({ msg: 'Invalid Or Expired Token' });
        }
        req.user = check;
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            checkTokenDatabase.destroy();
        }
        res.status(500).json({ msg: 'Internal Server Error', error: error });
    }
}

module.exports = checkAuth
