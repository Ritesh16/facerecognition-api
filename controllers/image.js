const Clarifai = require('clarifai');

const app = new Clarifai.App({
    // add your own
    apiKey: 'ad4917ee89a9492585dcb577ae012cf4'
   });

const handleApiCall = (req, res) => {
    app.models
       .predict(
          Clarifai.FACE_DETECT_MODEL,
          req.body.input)
       .then(data=> res.json(data))
       .catch(error=> res.state(400).json('Some error has occurred. Unable to connect to api'))
};

const handleImage =  (req,res, db) => {
    const {id} = req.body; 
    db('users').where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
          res.json(entries[0])
      })
      .catch(error => res.status(400).json('Unable to get entries'))
 }

 module.exports = {
     handleImage:handleImage,
     handleApiCall:handleApiCall
 };