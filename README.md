# Redirect/callback issue when using reverse proxy


## Reproduction steps

- Add `app.example.localhost` to your `/etc/hosts`
- `pnpm i`
- `npx auth secret`
- `caddy run` or use any tool to reverse proxy `app.example.localhost` to port 3000
- In a separate terminal: `pnpm dev`
- Visit [https://app.example.localhost](https://app.example.localhost)
- Notice the `Set-Cookie` response header:
```
__Secure-authjs.callback-url=https%3A%2F%2Fapp.example.localhost; Path=/; HttpOnly; Secure; SameSite=Lax
```
- Click `Sign In`
- Notice the `callbackUrl` query param is `https%3A%2F%2Fapp.example.localhost%2F`
- Notice the `Set-Cookie` response header:
```
__Secure-authjs.callback-url=https%3A%2F%2Flocalhost%3A3000; Path=/; HttpOnly; Secure; SameSite=Lax
```
- Sign in with credentials (`username` and `password`)
- Notice we are now at `https://localhost:3000/auth/callback/credentials` 😕