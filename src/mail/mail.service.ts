import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ReportesService } from 'src/reportes/reportes.service';

@Injectable()
export class MailService {
  constructor(
    private readonly reporteService: ReportesService,
  ) { }

  async sendWeeklyReport() {
    const excelBuffer = await this.reporteService.dataReporteEcxcel();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.REPORT_EMAIL_TO, // ✅ desde .env
      subject: '📊 Reporte semanal de concesionarias',
      text: 'Se adjunta el reporte semanal.',
      attachments: [
        {
          filename: 'reporte_semanal.xlsx',
          content: excelBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return 'Correo enviado';
  }
}
