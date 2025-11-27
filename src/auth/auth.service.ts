// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { TipoUsuario } from 'src/usuarios/entities/tipoUsuario.entity';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,
    @InjectRepository(TipoUsuario)
    private readonly tipoUsuario: Repository<TipoUsuario>,

    private readonly jwtService: JwtService,
  ) {}

  // 1) Valida email/password
  async validateUser(user1: LoginDto): Promise<Usuario> {
    const user = await this.userRepo.findOne({
      where: { correo_electronico: user1.email },
      relations: ['tipoUsuario'],
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const match = await bcrypt.compare(user1.pass, user.contraseña);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }

  // 2) Genera el JWT
  async login(user1: LoginDto) {
    let user = await this.validateUser(user1);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const payload = {
      sub: user.id_usuario,
      email: user.correo_electronico,
      tipo: user.tipoUsuario.tipoUsuario,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateCorreo(id: number, nombreNuevo: string) {
    const usuarios = await this.userRepo.findOne({ where: { id_usuario: id } });
    if (!usuarios) {
      throw new Error('usuaro no existe');
    }

    usuarios.correo_electronico = nombreNuevo;

    return await this.userRepo.save(usuarios);
  }

  async all() {
    const usuarios = await this.userRepo.find({ relations: ['tipoUsuario'] });
    return usuarios;
  }

  async register(dto: RegisterDto) {
    // 1) Verificar duplicado
    const exists = await this.userRepo.findOne({
      where: { correo_electronico: dto.email },
    });
    if (exists) {
      throw new ConflictException('El correo ya está registrado');
    }

    // 2) Hashear contraseña
    const hash = await bcrypt.hash(dto.pass, 10);
    if (!dto.tipoUsuario) {
      dto.tipoUsuario = 2;
    }
    let origen = await this.tipoUsuario.findOne({
      where: { id_tipoUsuario: dto.tipoUsuario },
    });
    if (!origen) {
      throw new NotFoundException('El tipo de usuario no existe');
    }

    // 3) Crear entidad Usuario
    const user = this.userRepo.create({
      correo_electronico: dto.email,
      contraseña: hash,
      tipoUsuario: origen,
    });

    // 4) Guardar en BD
    const saved = await this.userRepo.save(user);

    // 5) Devolver sin contraseña
    const { contraseña, ...result } = saved;
    return result;
  }

  async saveGoogleUser(email: string) {
    const user = await this.userRepo.findOne({
      where: { correo_electronico: email },
      relations: ['tipoUsuario'],
    });

    if (!user) {
      let id;
      if (email.endsWith('@pcpuma.acatlan.unam.mx')) {
        id = 2;
      } else {
        id = 3;
      }

      let user = await this.userRepo.save({ email, tipoUsuario: id });

      return { ...user, neeneedsPassword: true };
    }

    // Usuario con contraseña → login normal
    return user;
  }

  async setPassword(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { correo_electronico: dto.email },
      relations: ['tipoUsuario'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.contraseña) {
      throw new ConflictException('Este usuario ya tiene contraseña');
    }

    // Hash contraseña nueva
    const hash = await bcrypt.hash(dto.pass, 10);

    user.contraseña = hash;
    const updated = await this.userRepo.save(user);

    // Retornar con JWT inmediato (login automático)
    const payload = {
      sub: updated.id_usuario,
      email: updated.correo_electronico,
      tipo: updated.tipoUsuario.tipoUsuario,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
