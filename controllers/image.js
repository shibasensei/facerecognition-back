const Clarify = require('clarifai');

const app = new Clarify.App({
  apiKey:'03b5418dccea486e8635fcece57ed735'
});

const handleApiCall = () => (req,res)=>{
  app.models
  .predict(Clarify.FACE_DETECT_MODEL,req.body.input)
  .then(data=>{
    res.json(data);
  })
  .catch(error=>{
    if(error.data.status.code === 11102 || error.data.status.code === 10020)
      res.status(200).json('no pic found')
    else
      res.status(400).json('error in api')
  });
}

const handleImage = (db)=>(req,res)=>{
  const {id} = req.body;
  db('users').where({id})
  .increment('entries',1)
  .returning('entries')
  .then(entries=>{
    res.json(entries[0]);
  })
  .catch(err=>res.status(400).json('error'));
}

module.exports = {
  handleImage:handleImage,
  handleApiCall:handleApiCall
}
