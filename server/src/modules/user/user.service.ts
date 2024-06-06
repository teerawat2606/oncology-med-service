import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { InsertResult } from 'typeorm';
import {
  CredentialDto,
  SignUpDto,
  UserInfo,
  UserInfoWithUsername,
} from './user.dto';
import { UserRepository } from './user.repository';
import { UserRole } from 'src/enums';

export const extractUserInfo = (user: User): UserInfo => {
  const { username, password, ...rest } = user;
  return rest;
};

export const extractManyUserInfos = (users: User[]): UserInfo[] =>
  users.map((user) => {
    const { username, password, ...rest } = user;
    return rest;
  });

export const extractManyUserInfoWithUsername = (
  users: User[],
): UserInfoWithUsername[] => {
  return users.map((user) => {
    const { password, ...rest } = user;
    return rest;
  });
};

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(
    offset?: number,
    limit?: number,
  ): Promise<UserInfoWithUsername[]> {
    try {
      return extractManyUserInfoWithUsername(
        await this.userRepository.findAll(offset, limit),
      );
    } catch (error) {
      this.logger.error(
        `UserService:findAll: ${JSON.stringify(error.message)}`,
      );
      throw error;
    }
  }

  async findAllDoctors(): Promise<UserInfo[]> {
    try {
      return extractManyUserInfos(
        await this.userRepository.findAllByRole(UserRole.DOCTOR),
      );
    } catch (error) {
      this.logger.error(
        `UserService:findAllDoctors: ${JSON.stringify(error.message)}`,
      );
      throw error;
    }
  }

  async create(userDto: SignUpDto): Promise<InsertResult> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          username: userDto.username,
        },
      });

      if (existingUser) return null;

      return await this.userRepository.insertOne(userDto);
    } catch (error) {
      this.logger.log(`UserService:create: ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async findById(id: number): Promise<UserInfo> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found.');
      }
      return extractUserInfo(user);
    } catch (error) {
      this.logger.log(`UserService:findById: ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async findByUsernameForAuth(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findByUsername(username);
      console.log('🚀 ~ UserService ~ findByUsernameForAuth ~ user:', user);
      if (!user) {
        throw new Error('User not found.');
      }
      return user;
    } catch (error) {
      this.logger.log(
        `UserService:findByUsername: ${JSON.stringify(error.message)}`,
      );
      throw new Error(error.message);
    }
  }

  async findOneForSignIn(username: string): Promise<CredentialDto> {
    try {
      const user = await this.userRepository.findOneForSignIn(username);
      console.log('🚀 ~ UserService ~ findOneForSignIn ~ user:', user);
      return user;
    } catch (error) {
      this.logger.log(
        `UserService:findOneForSignIn: ${JSON.stringify(error.message)}`,
      );
      throw new Error(error.message);
    }
  }

  async delete(id: number) {
    try {
      return await this.userRepository.deleteById(id);
    } catch (error) {
      this.logger.log(`UserService:delete: ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }
}
