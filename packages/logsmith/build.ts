import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts', 'bin/cli.ts'],
  outdir: './dist',
  target: 'node',
  format: 'esm',
  // @ts-expect-error this exists, unsure why it is an issue
  splitting: true,
  minify: false, // TODO: re-implement later
  plugins: [dts()],
})
