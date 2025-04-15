Getting Started

# Use Supabase with Next.js

## Learn how to create a Supabase project, add some sample data, and query from a Next.js app.

---

1

### Create a Supabase project

Go to [database.new](https://database.new) and create a new Supabase project.

When your project is up and running, go to the [Table Editor](https://supabase.com/dashboard/project/_/editor), create a new table and insert some data.

Alternatively, you can run the following snippet in your project's [SQL Editor](https://supabase.com/dashboard/project/_/sql/new). This will create a `instruments` table with some sample data.

```
1

2

3

4

5

6

7

8

9

10

11

12

13

-- Create the tablecreate table instruments (  id bigint primary key generated always as identity,  name text not null);-- Insert some sample data into the tableinsert into instruments (name)values  ('violin'),  ('viola'),  ('cello');alter table instruments enable row level security;

```
### 

Make the data in your table publicly readable by adding an RLS policy:

```
1

2

3

4

create policy "public can read instruments"on public.instrumentsfor select to anonusing (true);

```
2

### Create a Next.js app

Use the `create-next-app` command and the `with-supabase` template, to create a Next.js app pre-configured with:

- [Cookie-based Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

```
1

npx create-next-app -e with-supabase

```
3

### Declare Supabase Environment Variables

Rename `.env.example` to `.env.local` and populate with your Supabase connection variables:

###### Project URL

Loading...

###### Anon key

Loading...

.env.local

```
1

2

NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUBSTITUTE_SUPABASE_ANON_KEY>

```
4

### Query Supabase data from Next.js

Create a new file at `app/instruments/page.tsx` and populate with the following.

This will select all the rows from the `instruments` table in Supabase and render them on the page.

app/instruments/page.tsxutils/supabase/server.ts

```
1

2

3

4

5

6

7

8

import { createClient } from '@/utils/supabase/server';export default async function Instruments() {  const supabase = await createClient();  const { data: instruments } = await supabase.from("instruments").select();  return <pre>{JSON.stringify(instruments, null, 2)}</pre>}

```
5

### Start the app

Run the development server, go to <http://localhost:3000/instruments> in a browser and you should see the list of instruments.

```
1

npm run dev

```
## Next steps[#](#next-steps)

- Set up [Auth](/docs/guides/auth) for your app
- [Insert more data](/docs/guides/database/import-data) into your database
- Upload and serve static files using [Storage](/docs/guides/storage)