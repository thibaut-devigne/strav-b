import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto)
    return await this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOne(email: string): Promise<User|undefined> {
    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
