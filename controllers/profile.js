const handleProfileUpdate = (req, res, db) => {
    const {name, age, pet} = req.body.formInput;
    const updates = {};

    if (name) updates.name = name;
    if (age && age > 0) updates.age = age;
    if (pet) updates.pet = pet;

    db("users")
        .where({ id: req.params.id })
        .update(updates)
        .then(response => {
            if (response) {
                res.json('success')
            } else {
                res.status(400).json('Unable to update')
            }
        })
        .catch(err => res.status(400).json(`Error ${err}`));

}

const handleProfileGet = (req, res, db) => {
    const {id} = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json(`error getting user`))
}

module.exports = {
    handleProfileGet,
    handleProfileUpdate
}
