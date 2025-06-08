declare module '@twa-dev/sdk' {
  export const WebApp: {
    initData: string;
    initDataUnsafe: any;
    ready: () => void;
    expand: () => void;
    close: () => void;
    sendData: (data: string) => void;
    themeParams: Record<string, string>;
    colorScheme: 'light' | 'dark';
  };
}