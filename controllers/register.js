const handleRegister = (req,res,db,bcrypt) => {
    const {email, name, password} = req.body;
    if(!email || !password || !name){
        return res.status(400).json('Please enter username/email/password');
    }
    const hash = bcrypt.hashSync(password);
    
    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(userEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: userEmail[0],
                    name: name,
                    joined: new Date()
                }).then(user => {
                        res.json(user[0])
                  })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        res.status(400).json('Some error has occured while registering')
    })
};

module.exports = {
    handleRegister:handleRegister
};
