let id,link,host;

const sendConfirmationEmail = (db,nodemailer,transporter) =>(req,res) =>{

    db('users')
    .where({ email:req.body.email})
    .then(row=>{
      id = row[0].id
      host=req.get('host');
      link="http://"+req.get('host')+"/verify?id="+row[0].id;
      const info = transporter.sendMail({
        from: 'theshibasensei@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Verify your email!', // Subject line
        html: "<br>Click on the <a href="+link+">link</a> to verify your email!<br>"
      })
      .then(info=>console.log('email sent'))
      .catch(error=>console.log());
    })
}

const confirmEmail = (db) => (req,res) =>{
  if((req.protocol+"://"+req.get('host'))==("http://"+host)){
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==id){
      db('users')
      .where({id})
      .update({isverified:true})
      .then(()=>{
        console.log("Email is verified");
        res.end("Email is verified");
      })
    }else{
        console.log("Email is not verified");
        res.end("<h1>Bad request</h1>");
    }
  }
  else{
    res.end("<h1>Email already verified :)(if not email me at theshibasensei@gmail.com)</h1>");
  }
}

module.exports = {
  sendConfirmationEmail:sendConfirmationEmail,
  confirmEmail:confirmEmail
}

//test
// const transporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//         user: 'theshibasensei@gmail.com',
//         pass: 'qnnrd11Q'
//     }
// });
//
// const mailOptions = {
//   from: 'theshibasensei@gmail.com', // sender address
//   to: 'verchonov.viacheslav@gmail.com', // list of receivers
//   subject: 'Verify your email!', // Subject line
//   html: '<p>Verify here!</p>'// plain text body
// };
//
//
// transporter.sendMail(mailOptions)
// .then(info=>console.log(info))
// .catch(error=>console.log());
