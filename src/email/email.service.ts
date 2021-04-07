import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: 'thehuskyhuskynews@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  });

  /**
   * Sends an email.
   * @param to array of recipients
   * @param subject email subject
   * @param content HTML content
   */
  async sendMail(to: string[], subject: string, content: string) {
    const info = await this.transporter.sendMail({
      from: '"The Husky Husky" <thehuskyhuskynews@gmail.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: content
    });

    console.log("Message sent: %s", info.messageId);
  }

  /* NOT USED
  async sendBulk(to, subject, template) {
    for (var i = 0; i < to.length; i++) {
      var content = template.replace("{{email}}", to[i]);
      await sendMail(to[i], subject, content);
    }

    console.log("Bulk mail sent");
  }
   */
}
