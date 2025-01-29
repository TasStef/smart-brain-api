const redisClient = require('../controllers/signin').redisClient;

const signoutAuthentication = (db, bcrypt) => async (req, res) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }

    console.log('signoutAuthentication:', authorization);
    try {
        const keys = await redisClient.keys(authorization);
        console.log('Number of keys', keys.length);
        if (keys.length === 0) {
            return res.status(400).json('Unauthorized');
        }
        const reply = await redisClient.del(keys);
        if (!reply) {
            return res.status(400).json('Unauthorized');
        }
    } catch (err) {
        console.log('getAuthTokenId:', err);
        return res.status(401).json('Unauthorized');
    }
    return res.json('Signed out');

}

module.exports = {
    signoutAuthentication: signoutAuthentication,
    redisClient: redisClient
}
