const STORAGE_KEY = 'pakkapass_ui_prefs';

const defaultPrefs = {
  dateRange: 'May 20 – May 26, 2025',
  notificationsCount: 12,
};

export const getUiPrefs = () => {
  try {
    return { ...defaultPrefs, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return defaultPrefs;
  }
};

export const setUiPrefs = (prefs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...getUiPrefs(), ...prefs }));
};
