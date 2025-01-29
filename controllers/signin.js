const jwt = require('jsonwebtoken');
const redis = require('redis');

// Redis client
let redisClient;

async function initRedis() {
    redisClient = redis.createClient({url: process.env.REDIS_URI})
        .on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();

    return redisClient;
}

initRedis()
    .then(() => console.log('Redis client connected'))
    .catch(err => console.log('Redis client connection error', err));


const handleSignin = (db, bcrypt, req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return Promise.reject('incorrect form submission');
    }
    return db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => user[0])
                    .catch(err => Promise.reject(`unable to get user ${err}`))
            } else {
                return Promise.reject('wrong credentials');
            }
        })
        .catch(err => Promise.reject(`wrong credentials ${err}`));
}

const getAuthTokenId = async (req, res) => {
    const {authorization} = req.headers;
    try {
        const reply = await redisClient.get(authorization);
        if (!reply) {
            return res.status(400).json('Unauthorized');
        }
        return res.json({id: reply});
    } catch (err) {
        console.log('getAuthTokenId:', err);
        return res.status(400).json('Unauthorized');
    }
}

const signToken = (email) => {
    const jwtPayload = {email};
    return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
};

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (user) => {
    // JWT token, return user data
    const {email, id} = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            return {
                success: 'true',
                userId: id, token
            }
        })
        .catch(console.log);
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const {authorization} = req.headers;
    console.log('authorization', authorization);
    return authorization ?
        getAuthTokenId(req, res) :
        handleSignin(db, bcrypt, req, res)
            .then(user => {
                return user.id && user.email ? createSessions(user) : Promise.reject(user)
            })
            .then(session => res.json(session))
            .catch(err => res.status(400).json(err));
}

module.exports = {
    signinAuthentication: signinAuthentication,
    redisClient: redisClient,
    createSessions: createSessions
}
