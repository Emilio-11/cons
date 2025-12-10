// src/movimiento/movimiento.module.ts
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ReportesService } from 'src/reportes/reportes.service';
import { ReportesModule } from 'src/reportes/reportes.module';
import { MailScheduler } from './mail.scheduler';

@Module({
  imports: [ReportesModule],

  providers: [MailService, MailScheduler],
  exports: [MailService],
})
export class MailModule { }
