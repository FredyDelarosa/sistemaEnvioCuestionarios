import { MailerService, SMTPConfig } from '../../domain/port/MailerService';
import { EmailJob } from '../../domain/model/EmailJob';

const nodemailer = require('nodemailer');

// B13: "Nombre" <correo>. Si la cuenta no tiene nombre se usa MAIL_FROM_NAME;
// si tampoco existe, solo la dirección (como antes).
function remitente(config: SMTPConfig): string | { name: string; address: string } {
  const nombre = config.fromName?.trim() || process.env.MAIL_FROM_NAME?.trim();
  return nombre ? { name: nombre, address: config.user } : config.user;
}

export class NodemailerService implements MailerService {
  async sendMail(config: SMTPConfig, job: EmailJob): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });

    await transporter.sendMail({
      from: remitente(config),
      to: job.to,
      subject: job.subject,
      html: job.html,
      text: job.text
    });
  }
}
