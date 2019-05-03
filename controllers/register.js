
const checkCorrectEmail =(email)=>{

  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const lowEmail = email.toLowerCase();

  if(lowEmail.match(mailformat))
    return lowEmail;
  else
    return false

}

const checkCorrectPassword = (password)=>{
  if(password.length<8)
    return false
  else
    return true
}

const handleRegister = (db, bcrypt) =>(req,res) =>{

  const {name, email, password} = req.body;
  const hash = bcrypt.hashSync(password);

  if(!checkCorrectPassword(password)){
    res.status(400).json(103) // password < 8
  }else{
      db.transaction(trx=>{
        if(!checkCorrectEmail(email)){
          res.status(400).json(100); //100 invalid email
        }else{
          const lowEmail = checkCorrectEmail(email);
          trx.insert({
            hash: hash,
            email: lowEmail
          })
          .into('login')
          .returning('email')
          .then(loginEmail=>{
            return trx('users')
              .returning('*')
              .insert({
                email:loginEmail[0],
                name:name,
                joined: new Date()
              })
              .then(user => res.json(user[0]));
          })
          .then(trx.commit)
          .catch(trx.rollback);
        }
      })
      .catch(err=>{
        if(err.code==='23505')
         res.status(400).json(101) // 101 already registered
        else
         res.status(400).json(102) // 102 i fucked up
      });
  }
}

module.exports = {
  handleRegister: handleRegister
}
