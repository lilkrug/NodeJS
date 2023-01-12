const nodemailer= require('nodemailer');
const smtpTransport= require('nodemailer-smtp-transport');

const sender= 'lilkrug2003@gmail.com';
const receiver= 'lilkrug_2003@mail.ru'
const pass= 'qrbknifcqyekneyh'

function send(message){
    let transporter = nodemailer.createTransport(smtpTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:sender,
            pass:pass
        }
    }));

    var mailOptions={
        from:sender,
        to:receiver,
        subject:'laba6',
        text:message
    };

    transporter.sendMail(mailOptions,function(error,info){
        error?console.log(error):console.log('Email sent: ' + info.response);
    })
};
module.exports = {send};