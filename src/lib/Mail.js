import nodemailer from 'nodemailer'
import { resolve } from 'path'
import expresshbs from 'express-handlebars'
import nodemailerhbs from 'nodemailer-express-handlebars'
import mail from '../config/mail'

class Mail {
  constructor() {
    const { host, port, secure, auth } = mail

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    })

    this.templates()
  }

  templates() {
    const viewsDir = resolve(__dirname, '..', 'app', 'views', 'emails')

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: expresshbs.create({
          layoutsDir: resolve(viewsDir, 'layouts'),
          partialsDir: resolve(viewsDir, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        views: viewsDir,
        extName: '.hbs',
      })
    )
  }

  send(message) {
    return this.transporter.sendMail({
      ...mail.default,
      ...message,
    })
  }
}

export default new Mail()
