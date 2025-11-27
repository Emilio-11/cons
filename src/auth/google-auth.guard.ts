import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  handleRequest(err, user, info, context) {
    const res = context.switchToHttp().getResponse();
    console.log('usuario: ', user);
    console.log('error: ', err);
    console.log('info: ', info);
    if (err) {
      // redirige directamente y corta la ejecución
      res.redirect(`${process.env.FRONTEND_URL}?error=oauth_failed`);
    }

    return user; // si existe, sigue normalmente
  }
}
