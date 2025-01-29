const redisClient = require('../controllers/signin').redisClient;

const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }

    try {
        const reply = await redisClient.get(authorization);
        if (!reply) {
            return res.status(400).json('Unauthorized');
        }
        console.log('You shall pass');
        return next();
    } catch (err) {
        console.log('getAuthTokenId:', err);
        return res.status(401).json('Unauthorized');
    }

}

module.exports = {
    requireAuth: requireAuth
}

