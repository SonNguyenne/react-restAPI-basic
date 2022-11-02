import {createTransport, SentMessageInfo} from 'nodemailer';
import {Users} from '../models';

import {UsersRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {Queue, QueueEvents, Worker} from 'bullmq';
const Redis = require('ioredis');
const redis = new Redis({
  port: 6379, // Redis port
  host: '127.0.0.1', // Redis host
  username: 'default', // needs Redis >= 6
  password: 'pando.dev',
  db: 0, // Defaults to 0
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

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

    await redis.on('error', (err: any) => {
      console.log('Error ' + err);
    });

    const myQueue = new Queue('code', {connection: redis});

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

    await myQueue.add(
      'timeout',
      {data: null},
      {delay: 30000, removeOnComplete: true},
    );

    new Worker(
      'code',
      async job => {
        this.UsersRepository.updateById(user.id, {codeResetPassword: ''});
      },
      {
        connection: redis,
      },
    );

    const queueEvents = new QueueEvents('code', {connection: redis});

    queueEvents.on('completed', ({jobId}) => {
      console.log(`${jobId} is done `);
    });

    queueEvents.on(
      'failed',
      ({jobId, failedReason}: {jobId: string; failedReason: string}) => {
        console.error('error painting', failedReason);
      },
    );

    return transporter.sendMail(email, (err, info) => {
      if (err) {
        console.log('errororor', err);
      } else {
        console.log('Email sent successfully', info);
      }
    });
  }
}
