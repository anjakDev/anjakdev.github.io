import { $ } from 'bun'

await $`rm -rf dist`
await $`bunx tailwindcss -i ./src/style.css -o ./dist/style.css`

const result = await Bun.build({
  entrypoints: ['./index.html'],
  outdir: './dist',
  target: 'browser',
  root: '.',
  publicPath: '/',
  define: {
    'import.meta.env.GH_ACTIVITY_TOKEN': JSON.stringify(process.env.GH_ACTIVITY_TOKEN ?? ''),
    'process.env.NODE_ENV': '"production"',
  },
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
})

if (!result.success) {
  for (const log of result.logs) console.error(log)
  process.exit(1)
}
