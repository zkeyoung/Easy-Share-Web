import type { Language } from './src/constant';

interface File {
  name: string;
  path: string;
  mime: string;
}

interface Settings {
  language: Language;
  host?: string;
  port: number;
}

interface CommonRes {
  code: number,
  msg: string,
}

interface CommonResData<T> extends CommonRes {
  data: T;
}

export interface Main {
  postFile: (file: File) => Promise<CommonResData<{ id: string, download: string }>>;
  deleteFile: (id: string) => Promise<CommonRes>;
  putSettings: (settings: Settings) => Promise<CommonRes>;
  getSettings: () => Promise<CommonResData<Settings>>;
  getIntranet: () => Promise<CommonResData<string>>;
  focusWebView: () => Promise<undefined>;
}

declare global {
  interface Window {
    $main: Main,
  }
}