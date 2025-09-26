import { I18n } from './i18n';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Mock window object
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('I18n', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  test('should initialize with default language when no saved language exists', () => {
    const i18n = new I18n();
    expect(i18n.getLanguage()).toBe('en');
  });

  test('should initialize with saved language from localStorage', () => {
    localStorageMock.setItem('culsim-language', 'vi');
    const i18n = new I18n();
    expect(i18n.getLanguage()).toBe('vi');
  });

  test('should save language to localStorage when setLanguage is called', async () => {
    const i18n = new I18n();
    await i18n.setLanguage('vi');
    expect(i18n.getLanguage()).toBe('vi');
    expect(localStorageMock.getItem('culsim-language')).toBe('vi');
  });

  test('should translate text correctly', () => {
    const i18n = new I18n('en');
    expect(i18n.t('ui.gameTitle')).toBe('🏮 CULSIM - Cultivation Simulator 🏮');
  });

  test('should translate text in Vietnamese when language is set to vi', () => {
    const i18n = new I18n('vi');
    expect(i18n.t('ui.gameTitle')).toBe('🏮 CULSIM - Trò Chơi Tu Luyện 🏮');
  });

  test('should handle parameter substitution', () => {
    const i18n = new I18n('en');
    expect(i18n.t('ui.meridianReq', { qi: 50 })).toBe('Req: 50 qi');
  });

  test('should get correct realm name', () => {
    const i18n = new I18n('en');
    expect(i18n.getRealmName(0)).toBe('Mortal');
    expect(i18n.getRealmName(1)).toBe('Qi Condensation');
  });

  test('should get correct meridian name', () => {
    const i18n = new I18n('en');
    expect(i18n.getMeridianName(0)).toBe('Governor Vessel');
    expect(i18n.getMeridianName(1)).toBe('Conception Vessel');
  });

  test('should persist language choice across instances', async () => {
    const i18n1 = new I18n();
    await i18n1.setLanguage('vi');

    // Create new instance - should load from localStorage
    const i18n2 = new I18n();
    expect(i18n2.getLanguage()).toBe('vi');
  });
});