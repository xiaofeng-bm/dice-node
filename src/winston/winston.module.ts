import { DynamicModule, Global, Module } from '@nestjs/common';
import { DiceLogger } from 'src/logger.service';
import { LoggerOptions } from 'typeorm';

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Global()
@Module({})
export class WinstonModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new DiceLogger(),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
