import { EmailJob } from '../model/EmailJob';

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName?: string; // B13: nombre que se muestra como remitente
}

export interface MailerService {
  sendMail(config: SMTPConfig, job: EmailJob): Promise<void>;
}
