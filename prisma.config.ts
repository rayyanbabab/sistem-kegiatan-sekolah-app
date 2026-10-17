import { defineConfig } from 'prisma/config'

const DATABASE_URL = process.env.DATABASE_URL!

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: DATABASE_URL,
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
})
