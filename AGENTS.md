# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `src/app`, where each folder maps to a route and pairs server/client components with co-located styles. Shared HTTP clients and interceptors sit in `src/axios`, cross-cutting helpers in `src/func`, and TypeScript contracts in `src/types`. Static assets (favicons, imagery) belong in `public`, while config such as `eslint.config.mjs`, `postcss.config.mjs`, and `tsconfig.json` at the root govern tooling.

## Build, Test, and Development Commands
Use `pnpm dev` to launch the local server on port 4000 with hot reload. `pnpm build` performs a production compile (type-check, route bundling, code splitting), and `pnpm start` serves the generated `.next` output. Run `pnpm lint` before every push to apply ESLint across all pages, components, and hooks.

## Coding Style & Naming Conventions
All source files are TypeScript or TSX with ES modules and 2-space indentation (see `src/app/layout.tsx` for reference). Export React components with PascalCase names (`DashboardHeader`), utilities and hooks with camelCase (`useAuthGuard`), and use kebab-case for directories or route segments (`src/app/admin/settings`). Keep imports path-based within `src` to avoid deep relative chains, and rely on ESLint + Next config for formatting instead of ad-hoc prettier rules.

## Testing Guidelines
No test runner is wired yet, so prioritize adding React Testing Library + Vitest when touching critical flows; mirror component paths (`src/app/users/__tests__/user-list.test.tsx`) so intent is obvious. Until automated coverage lands, pair `pnpm lint` with manual verification in multiple locales (ZH + EN) and rely on Storybook-style visual checks if applicable. Target ≥80 % coverage for shared helpers in `src/func` once instrumentation is introduced.

## Commit & Pull Request Guidelines
Follow Conventional Commits, as seen in `chore(deps): 更新依赖并添加 Ant Design 相关包`; scope additions like `feat(admin): add role guard middleware`. Keep commits focused, include English descriptions even if the summary is bilingual, and reference issue IDs when available. Pull requests should describe motivation, list test evidence (`pnpm build`, screenshots for UI), and mention any schema or environment impacts; attach before/after captures for Ant Design views when styling changes.

## Security & Configuration Tips
Never commit secrets—place them in `.env.local`, mirroring keys as `NEXT_PUBLIC_*` only when the value must reach the browser. Axios instances in `src/axios` automatically pick up tokens, so sanitize console output and prefer HTTP-only cookies for auth. When debugging, avoid logging PII and remove temporary interceptors before merging.
