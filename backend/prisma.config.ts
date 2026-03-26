import { PrismaPg } from '@prisma/adapter-pg';
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  },
});
