import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 处理跨域
  app.enableCors();
  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port')!);
}
bootstrap();
