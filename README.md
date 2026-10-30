# TechnoWorld storefront

A Vite storefront with a small Node API for product and order enquiries.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://127.0.0.1:5173`). The `dev` command starts both the API on port `8787` and Vite; Vite proxies `/api` requests to the API.

## Production preview

```sh
npm run build
npm run preview
```

The preview server serves `dist/` and the API from the same origin. Set `API_HOST` or `API_PORT` to change the API bind address or port.

## Enquiry storage

Quote requests and checkout enquiries are validated and saved to `.data/enquiries.json` on the server. This file is ignored by Git. The API does not send email, charge payment, or expose a public order-list endpoint. The storefront reports success only after the server confirms the write.

- `GET /api/health` — service health
- `POST /api/enquiries` — product/custom quote enquiry
- `POST /api/orders` — cart checkout enquiry

Order prices are treated as indicative; the server resolves product names and listed prices from its own catalog before saving. Payment and final pricing are confirmed directly with the supplier.


## Deploy to Render

The `render.yaml` Blueprint builds the Vite storefront and starts the Node API as one web service. In Render, create a new Blueprint Instance from this repository and select the `render.yaml` file.

The free plan uses an ephemeral filesystem. Customer profiles and enquiries saved under `.data/` can be cleared when Render restarts or redeploys the service. Use a persistent disk or managed database before relying on this for production customer records.
