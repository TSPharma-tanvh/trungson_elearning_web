import i18n from '@/i18n';

import AppStrings from './app-strings';
import StoreLocalManager from './store-manager';

export const SET_AUTH = 'SET_AUTH';
export const CHECK_AUTH = 'CHECK_AUTH';
export const SET_LOADING = 'SET_LOADING';

export const setAuth = (isAuthenticated: boolean) => ({
  type: SET_AUTH,
  payload: isAuthenticated,
});

export const setLoading = (isLoading: boolean) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const changeLanguage = (newLang: string) => () => {
  try {
    StoreLocalManager.saveLocalData(AppStrings.LANGUAGE, newLang);
  } catch (error) {
    return '';
  }
  void i18n.changeLanguage(newLang);
};

export const getStoredLanguage = (): string | null => {
  try {
    const language = StoreLocalManager.getLocalData(AppStrings.LANGUAGE);
    return language || 'en';
  } catch (error) {
    return 'en';
  }
};
