# GitIgnore Fetch

A worker for grabbing and storing github/gitignore files in [Cloudflare Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv).

#### Getting Started

```bash
cp wrangler.toml.example wrangler.toml
wrangler dev
```

You'll need to update the account id in `wrangler.toml`, which you can get by running `wrangler whoami`, as well as updating the `ID` and `PREVIEW_ID`. You can generate these with the following commands:

```bash
wrangler kv:namespace create "GITIGNORES"
wrangler kv:namespace create "GITIGNORES" --preview
```

And update them as follows:

```toml
kv_namespaces = [ 
  { binding = "GITIGNORES", id = "ID", preview_id = "PREVIEW_ID" }
]
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
