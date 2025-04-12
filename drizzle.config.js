import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_co7jeFfWd0un@ep-spring-wind-a1r61uhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  },
});
