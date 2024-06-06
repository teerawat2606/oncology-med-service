import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import session from 'express-session';
import passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { ConfigService } from '@nestjs/config';
import { SessionRepository } from './modules/session/session.repository';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });

  const configService = app.get<ConfigService>(ConfigService);
  const sessionRepository = app.get<Repository<Session>>(SessionRepository);

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: Boolean(configService.get<boolean>('SESSION_RESAVE')),
      saveUninitialized: Boolean(
        configService.get<boolean>('SESSION_SAVE_UNINITIALIZED'),
      ),
      cookie: { maxAge: +configService.get<number>('SESSION_MAX_AGE') },
      /* TO-DO: Config cookie for production
      // Example
      var app = express()
      var sess = {
        secret: 'keyboard cat',
        cookie: {}
      }

      if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sess.cookie.secure = true // serve secure cookies
      }

      app.use(session(sess)) */
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
        ttl: 86400,
      }).connect(sessionRepository),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // app.enableCors({
  //   origin: [
  //     configService.get<string>('ORIGIN_URL'),
  //     'http://192.168.229.3:3000',
  //   ],
  //   credentials: true,
  // });
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('BDMS Application Backend')
    .setDescription('The backend for BDMS API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
