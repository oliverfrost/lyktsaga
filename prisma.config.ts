import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'packages/data/prisma/schema.prisma',
  migrations: {
    path: 'packages/data/prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
    shadowDatabaseUrl: process.env['SHADOW_DATABASE_URL'],
  },
});
