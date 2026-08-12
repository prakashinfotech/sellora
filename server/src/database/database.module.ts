import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './models/user.model';
import { Category } from './models/category.model';
import { Ad } from './models/ad.model';
import { Favourite } from './models/favourite.model';
import { Message } from './models/message.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASS', 'postgres'),
        database: config.get('DB_NAME', 'sellora'),
        models: [User, Category, Ad, Favourite, Message],
        autoLoadModels: true,
        synchronize: false,
        logging: false,
        define: { underscored: true },
      }),
    }),
  ],
})
export class DatabaseModule {}
