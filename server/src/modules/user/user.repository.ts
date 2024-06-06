import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { InsertResult, Repository } from 'typeorm';
import { SignUpDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/enums';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async findAll(offset?: number, limit?: number): Promise<User[]> {
    const skip = offset || 0;
    if (limit === -1) {
      return this.find({ skip });
    } else {
      return this.find({ skip, take: limit });
    }
  }

  async findAllByRole(role: UserRole): Promise<User[]> {
    return this.find({ where: { role } });
  }

  async findById(id: number): Promise<User> {
    return this.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return this.findOneBy({ username });
  }

  async findOneForSignIn(username: string): Promise<User | null> {
    return this.findOne({
      select: ['username', 'password', 'employeeId'],
      where: {
        username,
      },
    });
  }

  async insertOne(user: SignUpDto): Promise<InsertResult> {
    return this.insert(user);
  }

  async deleteById(id: number): Promise<void> {
    await this.delete(id);
  }
}
