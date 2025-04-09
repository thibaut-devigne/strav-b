import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if(!user?.password) {
      throw new UnauthorizedException();
    }
    const hashedPassWord = user.password
    const isValidPassword = await bcrypt.compare(pass, hashedPassWord);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }
    
    const payload = { userId: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
