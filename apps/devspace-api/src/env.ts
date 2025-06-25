import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'node:path';
import { z } from 'zod';

expand(
  config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
    ),
  })
);

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3001),
});

export type Env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error('❌ Invalid env:');
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;
