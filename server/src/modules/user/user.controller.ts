import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserInfo, UserInfoWithUsername } from './user.dto';
import { UserService } from './user.service';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserInfo })
  @Get('user-info')
  getUserInfo(@Req() request: Request) {
    console.log('request', request.user);
    if (!request.user) throw new UnauthorizedException('User not logged in.');
    const user = {
      username: (request.user as any)?.username ?? '',
      id: (request.user as any)?.id ?? 0,
    };
    // return request.user as UserInfo;
    return this.userService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: [UserInfo] })
  @Get('doctor')
  getAllDoctors(): Promise<UserInfo[]> {
    try {
      return this.userService.findAllDoctors();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: [UserInfoWithUsername] })
  @Get('')
  getAllUsers(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<UserInfoWithUsername[]> {
    // if offset is not provided, set it to 0
    if (!offset) {
      offset = 0;
    }
    // if limit is not provided, set it to -1 to return all data
    if (!limit) {
      limit = -1;
    }
    try {
      return this.userService.findAll(Number(offset), Number(limit));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    try {
      await this.userService.delete(+userId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
