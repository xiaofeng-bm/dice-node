import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.join(__dirname, '.env')]
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        console.log('username', configService.get('mysql_server_username'));
        console.log('password', configService.get('mysql_server_password'));
        console.log('database', configService.get('mysql_server_database'));
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [User],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugins: 'sha256_password'
          }
        }
      },
      inject: [ConfigService]
    }),
    UserModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
