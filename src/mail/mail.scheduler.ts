import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailService } from './mail.service';

@Injectable()
export class MailScheduler {
  constructor(private readonly mailService: MailService) { }

  // 🕒 Cada lunes a las 8:00 AM
  @Cron('0 8 * * 1')
  async enviarReporteSemanal() {
    await this.mailService.sendWeeklyReport();
  }
}
