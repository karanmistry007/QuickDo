interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_SITE_NAME: string;
    readonly VITE_SOCKET_PORT: string;
    readonly VITE_AUTH_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
