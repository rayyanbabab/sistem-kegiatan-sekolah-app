import { defineConfig } from 'prisma/config'
import { PrismaNeon } from '@prisma/adapter-neon'

const DATABASE_URL = "postgresql://neondb_owner:npg_ez8FGpiU7qwm@ep-bitter-haze-ao63rnn3-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

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
