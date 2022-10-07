import {createTestAccount, createTransport, SentMessageInfo} from 'nodemailer';
import {Users} from '../models';

import {UsersRepository} from '../repositories';
import {repository} from '@loopback/repository';

export class EmailService {
  constructor(
    @repository(UsersRepository) protected UsersRepository: UsersRepository,
  ) {}

  private static async setupTransporter() {
    return createTransport({
      service: 'gmail',
      greetingTimeout: 1000,
      auth: {
        user: 'ts29032001@gmail.com',
        pass: 'plrsimmaijepppdv',
      },
    });
  }

  async sendResetPasswordMail(user: Users): Promise<SentMessageInfo> {
    const transporter = await EmailService.setupTransporter();

    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    const email = {
      to: user.email,
      subject: 'hello cu',
      html: `
      <div>
          ${code} Here code to reset your password
      </div>
      `,
    };

    await this.UsersRepository.updateById(user.id, {codeResetPassword: code});

    setTimeout(() => {
      this.UsersRepository.updateById(user.id, {codeResetPassw8ord: ''});
    }, 300000);
    return transporter.sendMail(email, (err, info) => {
      if (err) {
        console.log('errororor', err);
      } else {
        console.log('Email sent successfully', info);
      }
    });
  }
}
