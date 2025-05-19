import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';
import * as fs from 'fs';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

const env = process.env.NODE_ENV || 'development';

const httpsOptions =
  env === 'production'
    ? {
        key: fs.readFileSync('/ssl/cert.key'),
        cert: fs.readFileSync('/ssl/cert.pem'),
      }
    : undefined;

async function bootstrap() {
  const httpsOptions =
    env === 'production'
      ? {
          key: fs.readFileSync('/ssl/cert.key'),
          cert: fs.readFileSync('/ssl/cert.pem'),
        }
      : undefined;

  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions
  });

  // 处理跨域
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port')!);
}
bootstrap();
