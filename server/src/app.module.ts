import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BottleModule } from './modules/bottle/bottle.module';
import { CycleModule } from './modules/cycle/cycle.module';
import { DrugModule } from './modules/drug/drug.module';
import { PatientModule } from './modules/patient/patient.module';
import { RegimenModule } from './modules/regimen/regimen.module';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';
import { CaseModule } from './modules/case/case.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
      expandVariables: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: +configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        synchronize: JSON.parse(configService.get<string>('DATABASE_SYNC')),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    SessionModule,
    PatientModule,
    RegimenModule,
    DrugModule,
    BottleModule,
    CycleModule,
    CaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
