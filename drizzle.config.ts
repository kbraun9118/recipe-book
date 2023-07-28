import { Config } from 'drizzle-kit';

export default {
  schema: 'src/lib/db/schema.ts',
  out: 'migrations'
} satisfies Config;
