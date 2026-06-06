/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TWITCH_CLIENT_ID?: string;
  readonly PUBLIC_GOOGLE_EOI_FORM_URL?: string;
  readonly PUBLIC_GOOGLE_EOI_DEPLOYMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "node:fs" {
  export function existsSync(path: string | URL): boolean;
}

declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
}
