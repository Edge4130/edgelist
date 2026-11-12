# EdgeList

One rating engine, many topics. Each topic (WingList, BeerList, next whiskey) is a config file;
the engine renders its Score form, Log, Map and About from that config.

## How it fits together

- `src/topics/` one file per topic: branding, form blocks, scoring, bands, list layout, About text
- `src/blocks/` form building blocks: text, date, photo, location, pills, heat gauge, yes/no,
  sliders, stamp, BJCP style picker, judging scoresheet with flaws drawer
- `src/components/` the shared screens: ScoreForm, LogView, MapView, About, SignIn
- `src/lib/` data (store.js), owner login (auth.js), scoring, theming
- `src/admin/` the Topic Builder
- `supabase/` database setup, owner setup, the data copy, and the topics tables

Each Vercel project sets `VITE_TOPIC` (`wings` or `beer`) to choose its topic.
All topics share one GitHub repo and one Supabase project.

## Topic Builder

Open `/admin` on any EdgeList site (for example winglistapp.com/admin) and sign in as the owner.
Topics live in the `topics` table: you edit a draft, check it in the phone preview, then Publish.
Every publish is saved as a version you can load back into the draft. The apps read the published
version at startup and fall back to the bundled copies in `src/topics/` if the database is unreachable.

A new topic is created in the builder, published, then put online with one Vercel project from this
repo with `VITE_TOPIC` set to the topic's key.

## Security

Anyone can read and add entries. Only the owner (your Supabase login, listed in
`edgelist_admins`) can edit or delete, and the database enforces that.
Sign in from About, then Owner sign in.

## Local run

`npm install`, copy `.env.example` to `.env`, fill it in, `npm run dev`.
Without a `.env` the app runs in preview mode using browser storage.

## Credits

BeerList style information is Copyright 2021, Beer Judge Certification Program, Inc., used with
permission; scoresheet format Copyright 2019, BJCP.
