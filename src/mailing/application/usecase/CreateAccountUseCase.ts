import { EmailAccountRepository } from '../../domain/port/EmailAccountRepository';

export class CreateAccountUseCase {
  constructor(private repo: EmailAccountRepository) {}

  async execute(data: { email: string; password: string; host: string; port: number; daily_limit: number; display_name?: string | null }): Promise<any> {
    return this.repo.create(data);
  }
}
