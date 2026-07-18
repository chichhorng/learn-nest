import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'sqlite',
  database: process.env.DB_PATH || 'database.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Only for learning/development
}));
