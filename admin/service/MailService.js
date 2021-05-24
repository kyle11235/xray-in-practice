"use strict";
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'qq',
    host: 'smtp.qq.email',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.XRAY_DEMO_EMAIL, 
      pass: process.env.XRAY_DEMO_EMAIL_AUTH_TOKEN
    }
});

// async..await is not allowed in global scope, must use a wrapper
exports.send = async function (email) {
    if(email){
        email.from = '"xray whitelist demo" <'+ process.env.XRAY_DEMO_ADMIN_EMAIL +'>'; // sender address, should be same with auth user
    }else{
        console.log('invalid email');
        return false;    
    }
    // send mail with defined transport object
    let info = await transporter.sendMail(email);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    return true;
}

let example = {
    to: "xxx@qq.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
};

// this.send(example);
