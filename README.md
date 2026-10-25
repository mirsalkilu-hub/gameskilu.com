This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Admin Access

Apply the SQL migrations in `supabase/migrations` to configure post ordering and admin access.

Create an admin user in Supabase Authentication, then add its user UUID to the private allowlist from the Supabase SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('30d4176d-d540-4100-b7cc-c036f20e7f08')
on conflict (user_id) do nothing;
```

Only users in `public.admin_users` can create, edit, delete, or reorder posts. Public visitors can continue to read posts. Disable public sign-ups in Supabase Authentication settings if only invited admin accounts should exist.

## Automatic social publishing

When an admin creates a news or game download post, the site sends it to the configured Telegram channel and Facebook Page. Facebook publishing requires a Page access token with permission to create Page posts (typically `pages_manage_posts`) and the Facebook Page ID.

Set these server-side environment variables in `.env.local` for local development and in the production deployment settings:

```text
FACEBOOK_PAGE_ID=your-page-id
FACEBOOK_PAGE_ACCESS_TOKEN=your-page-access-token
FACEBOOK_GRAPH_API_VERSION=v24.0
```

`FACEBOOK_GRAPH_API_VERSION` is optional and defaults to `v24.0`. Keep the Page access token private and never use a `NEXT_PUBLIC_` prefix for it. If Facebook or Telegram publishing fails, the post remains saved on the site and the admin notification reports the failed delivery.

## Ezoic Ads

The Ezoic loader is disabled by default. After the site is approved and integrated in Ezoic, set `NEXT_PUBLIC_EZOIC_ADS_ENABLED=true` in `.env.local` for local testing and in the deployment environment for production. Rebuild/redeploy after changing this setting.

This only loads Ezoic's standalone Ads script; it does not create ad placements. Follow Ezoic's dashboard instructions to add the `ezstandalone` initialization, generated placeholder IDs, and matching placement elements before expecting ads to appear. The `/ads.txt` route redirects to Ezoic's ads.txt manager; confirm the domain is added to the Ezoic account and that `https://www.gameskilu.com/ads.txt` returns the seller list after deployment. Complete any domain/DNS integration steps requested by Ezoic in its dashboard. Existing ad scripts remain unchanged.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
