declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        expand: () => void;
        ready: () => void;
        close: () => void;
        sendData: (data: string) => void;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        colorScheme: 'light' | 'dark';
        isExpanded: boolean;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          isVisible: boolean;
        };
      };
    };
  }
}

export {};