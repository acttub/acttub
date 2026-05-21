# thea

Theater recommendation service for acttub.

## Local

```bash
npm install
npm run dev
```

## Subpath Deploy

Set `NEXT_PUBLIC_BASE_PATH=thea` when the app is served from `https://www.acttub.com/thea`.

For a separate Vercel project under the same domain, route `/thea/:path*` from the main acttub domain to this project and keep the same environment variable enabled so Next assets are emitted under `/thea`.
