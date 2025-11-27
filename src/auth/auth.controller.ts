import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';

import type { Response } from 'express';

import { GoogleAuthGuard } from './google-auth.guard';
import { LoginDto } from './dto/login-auth.dto';

interface Update {
  id: string;
  nombreNuevo: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //Comentar en producciòn

  @Post('update')
  async update(@Body() user: { id: number; nombreNuevo: string }) {
    return this.authService.updateCorreo(user.id, user.nombreNuevo);
  }

  @Get('findAll')
  async findAll() {
    this.authService.all();
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.login(dto);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return {
      userId: req.user.userId,
      email: req.user.email,
    };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { msg: 'Redirigiendo a Google' };
  }

  // Callback de Google
  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleCallback(@Req() req) {
  //   const user = req.user;

  //   if (user.needsPassword) {
  //     return {
  //       status: 'NEEDS_PASSWORD',
  //       email: user.correo,
  //       message: 'El usuario debe crear una contraseña antes de continuar',
  //     };
  //   }

  //   return this.authService.login(user); // genera JWT
  // }

  // auth.controller.ts
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res: Response) {
    const user = req.user;

    if (user.needsPassword) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/password?email=${user.correo}`,
      );
    }

    const jwt = await this.authService.login(user);

    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth-callback?token=${jwt.access_token}`,
    );
  }

  //Inicio de sesión con GOOGLE

  //Set-contraseña
  // auth.controller.ts

  @Post('set-password')
  async setPassword(@Body() dto: LoginDto) {
    return this.authService.setPassword(dto);
  }
}
