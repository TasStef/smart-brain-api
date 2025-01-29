const redisClient = require('../controllers/signin').redisClient;
const createSessions = require('../controllers/signin').createSessions;

const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        return createSessions(user[0])
                            .then(session => {
                                res.json(session);
                                trx.commit();
                            })
                            .catch(err => {
                                trx.rollback();
                                res.status(400).json('unable to create session');
                            });
                    });
            })
            .catch(err => {
                trx.rollback();
                res.status(400).json('unable to register', err);
            });
    })
        .catch(err => res.status(400).json('transaction failed'));
}

module.exports = {
    handleRegister: handleRegister
};
