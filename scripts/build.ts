import { $ } from 'bun'
import { writeGithubActivity } from './fetchGithubActivity'

await $`rm -rf dist`
await $`bunx tailwindcss -i ./src/style.css -o ./dist/style.css`

const result = await Bun.build({
  entrypoints: ['./index.html'],
  outdir: './dist',
  target: 'browser',
  root: '.',
  publicPath: '/',
  define: {
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

await writeGithubActivity('./dist/github-activity.json')
await $`[ -f reading-stats.json ] && cp reading-stats.json dist/reading-stats.json || true`
