import { defineConfig } from 'prisma/config'
import { PrismaNeon } from '@prisma/adapter-neon'

const DATABASE_URL = process.env.DATABASE_URL!

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    url: DATABASE_URL,
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  migrate: {
    async adapter() {
      const { neon } = await import('@neondatabase/serverless')
      const sql = neon(DATABASE_URL)
      return new PrismaNeon(sql as any)
    },
  },
})
