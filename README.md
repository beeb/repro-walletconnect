# Reproduction

https://github.com/blocknative/web3-onboard/issues/1568

1. `pnpm install`
1. `pnpm run build`
1. `pnpm run preview`
1. Click connect, then walletconnect

Error: `global is not defined`

# Fix

The `main` branch now implements a workaround for the issue, which consists of the following:

- Use `npm`. `pnpm` is not supported it seems, which is a shame
- Add the `buffer` package to polyfill Node's `Buffer` (can be added to dev deps)
- Somewhere in the app, polyfill `Buffer` like so:

```ts
import { Buffer } from 'buffer'
globalThis.Buffer = Buffer
```

- In the HTML template, add the following to fix the `global is not defined` error:

```html
<script>
  var global = global || window
</script>
```

- Note: no change was needed in the vite config

If this all feels like a hack, that's because it is. I would very much prefer those libraries and their dependencies
to be made for the browser natively, instead of relying on Node's API. Also, supporting `pnpm` would be nice since it
has grown in popularity lately.
