const {service} = require('koa-serve-decorator');
const nodemailer = require('nodemailer');
const {smtp} = require('../config');

@service
class EmailService{

    constructor(){
        this._transporter = nodemailer.createTransport({
            host: smtp.host,
            secure: true,
            auth:{
                user: smtp.user,
                pass: smtp.password
            }
        })
    }

    send(to, subject, content, options){
        this._transporter.sendMail({
            from: '"Remember-anfo.fun" <remember@anfo.fun>',
            to,
            subject, 
            html: content,
            ...options
        })
    }
}