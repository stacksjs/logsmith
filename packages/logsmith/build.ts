import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts', 'bin/cli.ts'],
  outdir: './dist',
  target: 'node',
  format: 'esm',
  minify: false, // TODO: re-implement later
  plugins: [dts()],
})
