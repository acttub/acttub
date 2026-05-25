# PR Draft: Unify Acttub into one Next.js web app

## Title

Unify Acttub into one Next.js web app

## Body

PR body file: `docs/nextjs-preview-pr-body.md`

## Create Command

No PR is currently open for `experiment/nextjs-preview` into `main`.

Browser URL:

```txt
https://github.com/acttub/acttub/compare/main...experiment/nextjs-preview?quick_pull=1
```

After GitHub CLI auth is fixed:

```bash
gh auth login -h github.com
corepack pnpm pr:preview
```

Equivalent direct command:

```bash
gh pr create --base main --head experiment/nextjs-preview --title "Unify Acttub into one Next.js web app" --body-file docs/nextjs-preview-pr-body.md
```
