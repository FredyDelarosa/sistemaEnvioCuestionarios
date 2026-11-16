export interface EmailAccount {
  id_account: number;
  email: string;
  display_name?: string | null;
  host: string;
  port: number;
  password_encrypted: string;
  daily_limit: number;
  current_usage: number;
  is_active: boolean;
}
