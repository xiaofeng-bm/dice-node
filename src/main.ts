import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';
import * as fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('/ssl/cert.key'),
  cert: fs.readFileSync('/ssl/cert.pem'),
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  // 处理跨域
  app.enableCors();

  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port')!);
}
bootstrap();
