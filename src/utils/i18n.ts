/**
 * Internationalization (i18n) translations for CULSIM
 * Supported languages: English (en) and Vietnamese (vi)
 */

export type Language = 'en' | 'vi';

export interface Translations {
  // UI Elements
  ui: {
    playerStatus: string;
    cultivationInfo: string;
    meridianInfo: string;
    meridianControls: string;
    timeInfo: string;
    gameOutput: string;
    startGame: string;
    stopGame: string;
    pauseGame: string;
    cultivate: string;
    saveGame: string;
    loadGame: string;
    clearSavedGame: string;
    unlockMeridian: string;
    unlockSelectedMeridian: string;
    allMeridiansOpen: string;
    meridianReq: string;
    gameStarted: string;
    gameStopped: string;
    gameLoaded: string;
    noSavedGame: string;
    savedGameCleared: string;
    confirmClearSavedGame: string;
    notEnoughQi: string;
    meridianOpened: string;
    loading: string;
    gameTitle: string;
    maxRealm: string;
    breakthroughs: string;
    qiGathering: string;
    days: string;
    years: string;
    months: string;
    meridiansOpen: string;
    qiPerDay: string;
    welcomeMessage: string;
    savedGameDetected: string;
    startingNewGame: string;
    autoLoadingGame: string;
    autoSaved: string;
  };

  // Game Status
  status: {
    player: string;
    realm: string;
    qi: string;
    talent: string;
    lifetime: string;
    reincarnation: string;
    karma: string;
    meridians: string;
    elements: string;
    time: string;
    gameSpeed: string;
    running: string;
    paused: string;
  };

  // Realm Names
  realms: {
    mortal: string;
    qiCondensation: string;
    foundationEstablishment: string;
    coreFormation: string;
    nascentSoul: string;
    divineTransformation: string;
    voidRefinement: string;
    immortalAscension: string;
  };

  // Meridian Names
  meridians: {
    governorVessel: string;
    conceptionVessel: string;
    stomach: string;
    spleen: string;
    heart: string;
    smallIntestine: string;
    bladder: string;
    kidney: string;
    pericardium: string;
    tripleBurner: string;
    gallbladder: string;
    liver: string;
  };

  // Game Messages
  messages: {
    startingJourney: string;
    cultivationSessionEnded: string;
    statusUpdate: string;
    day: string;
    meridianAttemptFailed: string;
    meridianPurified: string;
    breakthroughAttempt: string;
    breakthroughSuccess: string;
    breakthroughFailed: string;
    reincarnation: string;
    lifetimeSummary: string;
    totalQiGathered: string;
    maxRealmAchieved: string;
    karmicBalance: string;
    cultivationInsights: string;
    artifactsPreserved: string;
    newLifeBegins: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    ui: {
      playerStatus: 'Player Status',
      cultivationInfo: 'Cultivation',
      meridianInfo: 'Meridians',
      meridianControls: 'Meridian Controls',
      timeInfo: 'Time',
      gameOutput: 'Game Output',
      startGame: 'Start Game',
      stopGame: 'Stop Game',
      pauseGame: 'Pause',
      cultivate: 'Cultivate',
      saveGame: 'Save Game',
      loadGame: 'Load Game',
      clearSavedGame: 'Clear Saved Game',
      unlockMeridian: 'Unlock Meridian',
      unlockSelectedMeridian: 'Unlock Selected Meridian',
      allMeridiansOpen: 'All meridians open!',
      meridianReq: 'Req: {qi} qi',
      gameStarted: 'Game started!',
      gameStopped: 'Game stopped.',
      gameLoaded: 'Game loaded successfully!',
      noSavedGame: 'No saved game found.',
      savedGameCleared: 'Saved game cleared!',
      confirmClearSavedGame: 'Are you sure you want to clear the saved game? This action cannot be undone.',
      notEnoughQi: 'Not enough qi! Need {qi} qi to attempt opening {meridian}.',
      meridianOpened: 'Successfully opened {meridian} meridian!',
      loading: 'Loading...',
      gameTitle: '🏮 CULSIM - Cultivation Simulator 🏮',
      maxRealm: 'Max Realm',
      breakthroughs: 'Breakthroughs',
      qiGathering: 'Qi Gathering',
      days: 'days',
      years: 'years',
      months: 'months',
      meridiansOpen: 'open',
      qiPerDay: 'qi/day',
      welcomeMessage: 'Welcome to CULSIM!',
      savedGameDetected: 'Saved game detected. Auto-loading...',
      startingNewGame: 'Starting new cultivation journey...',
      autoLoadingGame: 'Auto-loading saved game...',
      autoSaved: '🔄 Auto-saved game progress!',
    },
    status: {
      player: 'Player',
      realm: 'Realm',
      qi: 'Qi',
      talent: 'Talent',
      lifetime: 'Lifetime',
      reincarnation: 'Reincarnation',
      karma: 'Karma',
      meridians: 'Meridians',
      elements: 'Elements',
      time: 'Time',
      gameSpeed: 'Game Speed',
      running: 'Running',
      paused: 'Paused',
    },
    realms: {
      mortal: 'Mortal',
      qiCondensation: 'Qi Condensation',
      foundationEstablishment: 'Foundation Establishment',
      coreFormation: 'Core Formation',
      nascentSoul: 'Nascent Soul',
      divineTransformation: 'Divine Transformation',
      voidRefinement: 'Void Refinement',
      immortalAscension: 'Immortal Ascension',
    },
    meridians: {
      governorVessel: 'Governor Vessel',
      conceptionVessel: 'Conception Vessel',
      stomach: 'Stomach',
      spleen: 'Spleen',
      heart: 'Heart',
      smallIntestine: 'Small Intestine',
      bladder: 'Bladder',
      kidney: 'Kidney',
      pericardium: 'Pericardium',
      tripleBurner: 'Triple Burner',
      gallbladder: 'Gallbladder',
      liver: 'Liver',
    },
    messages: {
      startingJourney: '🌅 Starting your cultivation journey...\n',
      cultivationSessionEnded: '🏮 Cultivation session ended.',
      statusUpdate: '📊 Status Update (Day {day})',
      day: 'Day',
      meridianAttemptFailed: '❌ Failed to open {meridian} meridian.',
      meridianPurified: '✨ {meridian} purified to {purity}%',
      breakthroughAttempt: '⚡ Attempting breakthrough to {realm}...',
      breakthroughSuccess: '🎉 Breakthrough successful! Reached {realm}!',
      breakthroughFailed: '💔 Breakthrough failed. Cultivation insights gained.',
      reincarnation: '🔄 Reincarnating...',
      lifetimeSummary: '📈 Lifetime Summary:',
      totalQiGathered: 'Total Qi Gathered: {qi}',
      maxRealmAchieved: 'Max Realm Achieved: {realm}',
      karmicBalance: 'Karmic Balance: {karma}',
      cultivationInsights: 'Cultivation Insights: {insights}',
      artifactsPreserved: 'Artifacts Preserved: {artifacts}',
      newLifeBegins: '🌱 New life begins...',
    },
  },
  vi: {
    ui: {
      playerStatus: 'Trạng Thái Người Chơi',
      cultivationInfo: 'Tu Luyện',
      meridianInfo: 'Kinh Mạch',
      meridianControls: 'Điều Khiển Kinh Mạch',
      timeInfo: 'Thời Gian',
      gameOutput: 'Đầu Ra Trò Chơi',
      startGame: 'Bắt Đầu Trò Chơi',
      stopGame: 'Dừng Trò Chơi',
      pauseGame: 'Tạm Dừng',
      cultivate: 'Tu Luyện',
      saveGame: 'Lưu Trò Chơi',
      loadGame: 'Tải Trò Chơi',
      clearSavedGame: 'Xóa Trò Chơi Đã Lưu',
      unlockMeridian: 'Mở Khóa Kinh Mạch',
      unlockSelectedMeridian: 'Mở Khóa Kinh Mạch Đã Chọn',
      allMeridiansOpen: 'Tất cả kinh mạch đã mở!',
      meridianReq: 'Cần: {qi} khí',
      gameStarted: 'Trò chơi đã bắt đầu!',
      gameStopped: 'Trò chơi đã dừng.',
      gameLoaded: 'Đã tải trò chơi thành công!',
      noSavedGame: 'Không tìm thấy trò chơi đã lưu.',
      savedGameCleared: 'Đã xóa trò chơi đã lưu!',
      confirmClearSavedGame: 'Bạn có chắc chắn muốn xóa trò chơi đã lưu? Hành động này không thể hoàn tác.',
      notEnoughQi: 'Không đủ khí! Cần {qi} khí để thử mở {meridian}.',
      meridianOpened: 'Đã mở thành công kinh mạch {meridian}!',
      loading: 'Đang tải...',
      gameTitle: '🏮 CULSIM - Trò Chơi Tu Luyện Trung Hoa 🏮',
      maxRealm: 'Cảnh Giới Cao Nhất',
      breakthroughs: 'Đột Phá',
      qiGathering: 'Thu Thập Khí',
      days: 'ngày',
      years: 'năm',
      months: 'tháng',
      meridiansOpen: 'đã mở',
      qiPerDay: 'khí/ngày',
      welcomeMessage: 'Chào mừng đến với CULSIM!',
      savedGameDetected: 'Phát hiện trò chơi đã lưu. Đang tự động tải...',
      startingNewGame: 'Bắt đầu hành trình tu luyện mới...',
      autoLoadingGame: 'Đang tự động tải trò chơi đã lưu...',
      autoSaved: '🔄 Tự động lưu tiến trình trò chơi!',
    },
    status: {
      player: 'Người Chơi',
      realm: 'Cảnh Giới',
      qi: 'Khí',
      talent: 'Tài Năng',
      lifetime: 'Tuổi Thọ',
      reincarnation: 'Tái Sinh',
      karma: 'Nghiệp Lực',
      meridians: 'Kinh Mạch',
      elements: 'Ngũ Hành',
      time: 'Thời Gian',
      gameSpeed: 'Tốc Độ Trò Chơi',
      running: 'Đang Chạy',
      paused: 'Tạm Dừng',
    },
    realms: {
      mortal: 'Phàm Nhân',
      qiCondensation: 'Luyện Khí',
      foundationEstablishment: 'Trúc Cơ',
      coreFormation: 'Kim Đan',
      nascentSoul: 'Nguyên Anh',
      divineTransformation: 'Hóa Thần',
      voidRefinement: 'Luyện Không',
      immortalAscension: 'Phi Thăng',
    },
    meridians: {
      governorVessel: 'Đốc Mạch',
      conceptionVessel: 'Nhâm Mạch',
      stomach: 'Vị Kinh',
      spleen: 'Tỳ Kinh',
      heart: 'Tâm Kinh',
      smallIntestine: 'Tiểu Trường Kinh',
      bladder: 'Bàng Quang Kinh',
      kidney: 'Thận Kinh',
      pericardium: 'Tâm Bao Kinh',
      tripleBurner: 'Tam Tiêu Kinh',
      gallbladder: 'Đởm Kinh',
      liver: 'Gan Kinh',
    },
    messages: {
      startingJourney: '🌅 Bắt đầu hành trình tu luyện của bạn...\n',
      cultivationSessionEnded: '🏮 Kỳ tu luyện kết thúc.',
      statusUpdate: '📊 Cập Nhật Trạng Thái (Ngày {day})',
      day: 'Ngày',
      meridianAttemptFailed: '❌ Thất bại khi mở kinh mạch {meridian}.',
      meridianPurified: '✨ Kinh mạch {meridian} tinh lọc đạt {purity}%',
      breakthroughAttempt: '⚡ Đang thử đột phá lên {realm}...',
      breakthroughSuccess: '🎉 Đột phá thành công! Đạt {realm}!',
      breakthroughFailed: '💔 Đột phá thất bại. Nhận được hiểu biết tu luyện.',
      reincarnation: '🔄 Đang tái sinh...',
      lifetimeSummary: '📈 Tóm Tắt Tuổi Thọ:',
      totalQiGathered: 'Tổng Khí Thu Thập: {qi}',
      maxRealmAchieved: 'Cảnh Giới Cao Nhất: {realm}',
      karmicBalance: 'Cân Bằng Nghiệp Lực: {karma}',
      cultivationInsights: 'Hiểu Biết Tu Luyện: {insights}',
      artifactsPreserved: 'Pháp Bảo Giữ Lại: {artifacts}',
      newLifeBegins: '🌱 Cuộc đời mới bắt đầu...',
    },
  },
};

/**
 * Translation helper function
 */
export class I18n {
  private currentLanguage: Language = 'en';
  private readonly STORAGE_KEY = 'culsim-language';

  constructor(language?: Language) {
    // Load saved language from localStorage, fallback to parameter or default
    const savedLanguage = this.loadSavedLanguage();
    this.currentLanguage = savedLanguage || language || 'en';
  }

  private loadSavedLanguage(): Language | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'en' || saved === 'vi') {
        return saved as Language;
      }
    }
    return null;
  }

  private saveLanguage(language: Language): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, language);
    }
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    this.saveLanguage(language);
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Get translated text with optional parameter substitution
   */
  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in any language
          }
        }
        break;
      }
    }

    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Get realm name
   */
  getRealmName(realm: number): string {
    const realmNames = {
      0: 'realms.mortal',
      1: 'realms.qiCondensation',
      2: 'realms.foundationEstablishment',
      3: 'realms.coreFormation',
      4: 'realms.nascentSoul',
      5: 'realms.divineTransformation',
      6: 'realms.voidRefinement',
      7: 'realms.immortalAscension',
    };

    return this.t(realmNames[realm as keyof typeof realmNames] || 'realms.mortal');
  }

  /**
   * Get meridian name
   */
  getMeridianName(index: number): string {
    const meridianNames = {
      0: 'meridians.governorVessel',
      1: 'meridians.conceptionVessel',
      2: 'meridians.stomach',
      3: 'meridians.spleen',
      4: 'meridians.heart',
      5: 'meridians.smallIntestine',
      6: 'meridians.bladder',
      7: 'meridians.kidney',
      8: 'meridians.pericardium',
      9: 'meridians.tripleBurner',
      10: 'meridians.gallbladder',
      11: 'meridians.liver',
    };

    return this.t(meridianNames[index as keyof typeof meridianNames] || 'meridians.governorVessel');
  }
}

// Global i18n instance
export const i18n = new I18n();