import { reactive } from 'vue';
import type { Settings } from '../../preload';
import { Language } from '../constant';

interface Store {
  settings: Settings,
  putSettings: (settings: Partial<Settings>) => void;
}

export const store = reactive<Store>({
  settings: {
    language: Language.enUS,
    host: undefined,
    port: 8888,
  },

  putSettings(settings: Partial<Settings>) {
    this.settings = Object.assign(this.settings, settings);
  }
});