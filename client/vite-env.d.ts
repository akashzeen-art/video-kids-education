/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VAS_PRODUCT_CODE?: string;
  readonly VITE_VAS_CAMPAIGN_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
