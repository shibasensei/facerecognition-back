let link,host,emailTemp,hashTemp;

const checkCorrectPassword = (password)=>{
  if(password.length<8)
    return false
  else
    return true
}

const sendReset = (db,nodemailer,transporter,bcrypt) => (req,res) => {
  const {email, password} = req.body;

  if(checkCorrectPassword(password)){
    hashTemp = bcrypt.hashSync(password)
    emailTemp = email.toLowerCase()
    db('login')
    .where({email})
    .then(row=>{
      if(row.length === 1){
        db('login')
        .where({ email:email})
        .update({temphash:hashTemp})
        .then(()=>{
          host=req.get('host');
          link="http://"+req.get('host')+"/resetDone?check="+hashTemp+"&email="+email;
          const info = transporter.sendMail({
            from: 'theshibasensei@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: 'Reseting your password!', // Subject line
            html: "<br>Click on the <a href="+link+">link</a> to reset your password!<br>"
          })
          .then(info=>res.status(200).json(777))
          .catch(error=>res.status(400).json(666));
        })
      }else{
        res.status(400).json(101)
      }
    })

  }else{
    res.status(400).json(103)
  }



}

const confirmReset = (db) => (req,res) => {

  if((req.protocol+"://"+req.get('host'))==("http://"+host)){
    if(emailTemp === req.query.email && hashTemp === req.query.check){
      db('login')
      .where({email:req.query.email})
      .then(row=>{
        console.log(row[0].temphash)
        if(row[0].temphash === "1"){
          res.end('<h1>password already changed!</h1>')
        }else{
          db('login')
          .where({email:req.query.email})
          .update({hash:req.query.check,temphash:1})
          .then(()=>{
            res.end('<h1>Password changed!</h1>')
          })
        }
      })
    }else{
      res.end("<h1>Wrong link</h1>");
    }
  }else{
    res.end("<h1>Wrong link</h1>");
  }

}

module.exports = {
  sendReset:sendReset,
  confirmReset:confirmReset
}
