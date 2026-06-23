# Kids Mela Ecommerce Storefront

Standalone React/Vite storefront UI for Kids Mela.

This project does not own the database, Laravel models, migrations, or backend controllers. It talks to the shared backend in `progotix-api`.

## Local Setup

```bash
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5174
```

If using Herd or a local proxy, the intended app URL is:

```text
http://progotix-ecommerce.test
```

## API

Set the API base URL in `.env`:

```env
VITE_API_BASE_URL=http://progotix-api.test/api
```
# kids-mela-ecommerce
