const handleProfile = (req, res, db) => {
    const {id} = req.params;
  
    db.select('*').from('users')
      .where({id})
      .then(users => {
          if(users.length){
              res.json(users[0]);
          }
          else{
              res.status(400).json('Not found');
          }
      })
      .catch(error => res.json('Some error has occurred while fetching user.'));
  };

  module.exports = {
      handleProfile:handleProfile
  }