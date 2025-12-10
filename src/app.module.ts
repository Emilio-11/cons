import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConsecionariasModule } from './consecionarias/consecionarias.module';
import { ReportesModule } from './reportes/reportes.module';
import { AuthModule } from './auth/auth.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: process.env.AUTOLOAD === 'true',
      synchronize: process.env.SINCRONIZAR === 'true',
      logger: 'advanced-console',
      logging: 'all',
    }),

    UsuariosModule,

    ConsecionariasModule,

    ReportesModule,

    AuthModule,

    GoogleDriveModule,

    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
