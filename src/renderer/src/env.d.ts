/// <reference types="vite/client" />

interface Window {
  api: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    getPasswords: () => Promise<any[]>;
    addPassword: (data: {service: string, username: string, password: string}) => Promise<any>;
  }
}