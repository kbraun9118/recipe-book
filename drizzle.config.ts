import { Config } from 'drizzle-kit';

export default {
  schema: 'src/lib/db/schema/*',
  out: 'migrations'
} satisfies Config;
