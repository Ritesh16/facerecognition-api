const handleSignIn = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json('Please enter username/password');
    }

    db.select('email', 'hash')
      .from('login')
      .where('email','=', req.body.email)
      .then(data => {
          if(data.length){
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(isValid){
              return db.select('*').from('users')
                  .where('email','=', req.body.email)
                  .then(data => {
                      res.json(data[0])
                  })
                  .catch(error=> res.status(400).json('User not found!'))
            }
            else{
                res.status(400).json('Invalid credentials');
            }  
          }
          else{
              res.status(400).json('Invalid credentials');
          }
      });
};

module.exports = {
   handleSignIn:handleSignIn
};