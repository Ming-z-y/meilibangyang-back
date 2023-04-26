import defaultSettings from '../settings.json';
import { atom } from "recoil";

export interface GlobalState {
  settings?: typeof defaultSettings;
  userInfo?: {
    id?: string;
    account?: string;
    level?: "1" | "2";
    name?: string;
    avatar?: string;
    superior?: string;
    permissions?: Record<string, string[]>;
  }
  userLoading?: boolean;
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {
    permissions: {}
  }
}

export const globalState = atom({
  key: 'globalState',
  default: initialState
})

