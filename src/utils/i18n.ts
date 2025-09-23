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
    manualCultivationComplete: string;
    breakthrough: string;
    alreadyMaxRealm: string;
    breakthroughNotAvailable: string;
    debugPanel: string;
    addQi: string;
    debugTitle: string;
    addCultivation: string;
    addMeridians: string;
    addElements: string;
    qiUnit: string;
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

  // Element Names
  elements: {
    metal: string;
    wood: string;
    water: string;
    fire: string;
    earth: string;
  };

  // Event Names
  events: {
    fortuitousEncounter: string;
    tribulationChallenge: string;
    karmicReward: string;
    enemyEncounter: string;
  };

  // Game Messages
  messages: {
    startingJourney: string;
    cultivationSessionEnded: string;
    statusUpdate: string;
    day: string;
    meridianAttemptFailed: string;
    meridianPurified: string;
    meridianOpeningFailed: string;
    meridianBreakthroughAttempt: string;
    meridianBreakthroughSuccess: string;
    meridianBreakthroughStageAdvanced: string;
    meridianBreakthroughFailed: string;
    meridianBreakthroughNotEnoughQi: string;
    meridianBreakthroughNotOpen: string;
    meridianBreakthroughNotReady: string;
    meridianBreakthroughAlreadyPerfect: string;
    meridianBreakthroughInvalidIndex: string;
    breakthroughAttempt: string;
    breakthroughSuccess: string;
    breakthroughFailed: string;
    breakthroughRequirements: string;
    breakthroughQiRequirement: string;
    breakthroughMeridianRequirement: string;
    breakthroughPurifiedMeridianRequirement: string;
    breakthroughHighlyPurifiedMeridianRequirement: string;
    breakthroughPerfectMeridianRequirement: string;
    breakthroughElementRequirement: string;
    breakthroughAllElementsRequirement: string;
    breakthroughDivineElementsRequirement: string;
    breakthroughRequirementsMet: string;
    breakthroughRequirementsNotMet: string;
    reincarnation: string;
    lifetimeSummary: string;
    totalQiGathered: string;
    maxRealmAchieved: string;
    karmicBalance: string;
    cultivationInsights: string;
    artifactsPreserved: string;
    newLifeBegins: string;
    randomEvent: string;
    fortuitousEncounter: string;
    tribulationChallengeSuccess: string;
    tribulationChallengeFailure: string;
    karmicReward: string;
    enemyEncounter: string;
    enemyDefeated: string;
    enemyDefeatedBy: string;
    tribulationStart: string;
    tribulationSuccess: string;
    breakthroughAdvanced: string;
    maxQiIncreased: string;
    elementCultivationEnabled: string;
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
      manualCultivationComplete: '✨ Manual cultivation complete! Gained {qi} qi.',
      breakthrough: 'Breakthrough',
      alreadyMaxRealm: 'Already at maximum realm!',
      breakthroughNotAvailable: 'Breakthrough not available for current realm.',
      debugPanel: 'Debug Panel',
      addQi: 'Add 10 Qi',
      debugTitle: 'Debug Panel',
      addCultivation: 'Add Cultivation (10 Qi + 10% Meridians + 10% Elements)',
      addMeridians: 'Add 10% Meridians',
      addElements: 'Add 10% Elements',
      qiUnit: 'qi',
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
    elements: {
      metal: 'Metal (金)',
      wood: 'Wood (木)',
      water: 'Water (水)',
      fire: 'Fire (火)',
      earth: 'Earth (土)',
    },
    events: {
      fortuitousEncounter: 'Fortuitous Encounter',
      tribulationChallenge: 'Tribulation Challenge',
      karmicReward: 'Karmic Reward',
      enemyEncounter: 'Enemy Encounter',
    },
    messages: {
      startingJourney: '🌅 Starting your cultivation journey...\n',
      cultivationSessionEnded: '🏮 Cultivation session ended.',
      statusUpdate: '📊 Status Update (Day {day})',
      day: 'Day',
      meridianAttemptFailed: '❌ Failed to open {meridian} meridian.',
      meridianPurified: '✨ {meridian} purified to {purity}%',
      meridianOpeningFailed: '❌ Failed to open {meridian} meridian. Success chance: {chance}%. Consumed {qi} qi.',
      meridianBreakthroughAttempt: '🔥 Attempting meridian breakthrough for {meridian}. Cost: {qi} qi. Success chance: {chance}%',
      meridianBreakthroughSuccess: '🎉 Meridian breakthrough successful! {meridian} purity increased from {oldPurity}% to {newPurity}%. Consumed {qi} qi.',
      meridianBreakthroughStageAdvanced: '⭐ {meridian} breakthrough stage advanced from {oldStage} to {newStage}!',
      meridianBreakthroughFailed: '💔 Meridian breakthrough failed. {meridian} purity decreased by {purityLoss}%. Consumed {qi} qi.',
      meridianBreakthroughNotEnoughQi: '❌ Not enough qi for meridian breakthrough. Required: {qi} qi.',
      meridianBreakthroughNotOpen: '❌ Cannot breakthrough {meridian} - meridian is not open.',
      meridianBreakthroughNotReady: '❌ Cannot breakthrough {meridian} - requires {required}% purity first.',
      meridianBreakthroughAlreadyPerfect: '✨ {meridian} is already at perfect purity.',
      meridianBreakthroughInvalidIndex: '❌ Invalid meridian index.',
      breakthroughAttempt: '⚡ Attempting breakthrough to {realm}...',
      breakthroughSuccess: '🎉 Breakthrough successful! Reached {realm}!',
      breakthroughFailed: '💔 Breakthrough failed. Cultivation insights gained.',
      breakthroughRequirements: '📋 Requirements for {realm} breakthrough:',
      breakthroughQiRequirement: '   💎 Qi: {current}/{required} {status}',
      breakthroughMeridianRequirement: '   🫀 Open Meridians: {current}/{required} {status}',
      breakthroughPurifiedMeridianRequirement: '   🫀 Purified Meridians (80%+): {current}/{required} {status}',
      breakthroughHighlyPurifiedMeridianRequirement: '   🫀 Highly Purified Meridians (95%+): {current}/{required} {status}',
      breakthroughPerfectMeridianRequirement: '   🫀 Perfect Meridians (100%): {current}/{required} {status}',
      breakthroughElementRequirement: '   🌟 Fully Cultivated Elements: {current}/{required} {status}',
      breakthroughAllElementsRequirement: '   🌟 All Elements Mastered: {current}/{required} {status}',
      breakthroughDivineElementsRequirement: '   🌟 Divine Elements: {current}/{required} {status}',
      breakthroughRequirementsMet: '🎯 Requirements met! Facing {tribulation} tribulation...',
      breakthroughRequirementsNotMet: '❌ Breakthrough requirements not met. Continue cultivating!',
      reincarnation: '🔄 Reincarnating...',
      lifetimeSummary: '📈 Lifetime Summary:',
      totalQiGathered: 'Total Qi Gathered: {qi}',
      maxRealmAchieved: 'Max Realm Achieved: {realm}',
      karmicBalance: 'Karmic Balance: {karma}',
      cultivationInsights: 'Cultivation Insights: {insights}',
      artifactsPreserved: 'Artifacts Preserved: {artifacts}',
      newLifeBegins: '🌱 New life begins...',
      randomEvent: '🎲 Random Event: {event}',
      fortuitousEncounter: '✨ Met a mysterious master! Talent increased by {talent}.',
      tribulationChallengeSuccess: '⚡ Survived a minor tribulation! Gained {insights} tribulation insights.',
      tribulationChallengeFailure: '💥 Failed tribulation challenge! Lost {qi} qi.',
      karmicReward: '🙏 Performed a good deed! Karmic balance increased by {karma}.',
      enemyEncounter: '👹 Encountered {enemy} (Realm: {realm}, Qi: {qi}/{maxQi})',
      enemyDefeated: '✅ Defeated {enemy}!',
      enemyDefeatedBy: '❌ Defeated by {enemy}! Lost {damage} qi.',
      tribulationStart: '⚡ Heavenly Tribulation: {type}! Success rate: {rate}%',
      tribulationSuccess: '✨ Tribulation overcome! Breakthrough successful!',
      breakthroughAdvanced: '🚀 Breakthrough successful! Advanced to {realm} realm!',
      maxQiIncreased: '💎 Max Qi increased to {maxQi}',
      elementCultivationEnabled: '🌟 New elements available for cultivation: {elements}',
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
      gameTitle: '🏮 CULSIM - Trò Chơi Tu Luyện 🏮',
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
      manualCultivationComplete: '✨ Tu luyện thủ công hoàn thành! Nhận được {qi} khí.',
      breakthrough: 'Đột Phá',
      alreadyMaxRealm: 'Đã đạt cảnh giới cao nhất!',
      breakthroughNotAvailable: 'Đột phá không khả dụng cho cảnh giới hiện tại.',
      debugPanel: 'Bảng Gỡ Lỗi',
      addQi: 'Thêm 10 Khí',
      debugTitle: 'Bảng Gỡ Lỗi',
      addCultivation: 'Thêm Tu Luyện (10 Khí + 10% Kinh Mạch + 10% Ngũ Hành)',
      addMeridians: 'Thêm 10% Kinh Mạch',
      addElements: 'Thêm 10% Ngũ Hành',
      qiUnit: 'khí',
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
    elements: {
      metal: 'Kim (金)',
      wood: 'Mộc (木)',
      water: 'Thủy (水)',
      fire: 'Hỏa (火)',
      earth: 'Thổ (土)',
    },
    events: {
      fortuitousEncounter: 'Hào Ngẫu Chi Kiếp',
      tribulationChallenge: 'Thử Thách Kiếp Nạn',
      karmicReward: 'Thưởng Nghiệp Lực',
      enemyEncounter: 'Gặp Kẻ Thù',
    },
    messages: {
      startingJourney: '🌅 Bắt đầu hành trình tu luyện của bạn...\n',
      cultivationSessionEnded: '🏮 Kỳ tu luyện kết thúc.',
      statusUpdate: '📊 Cập Nhật Trạng Thái (Ngày {day})',
      day: 'Ngày',
      meridianAttemptFailed: '❌ Thất bại khi mở kinh mạch {meridian}.',
      meridianPurified: '✨ Kinh mạch {meridian} tinh lọc đạt {purity}%',
      meridianOpeningFailed: '❌ Thất bại khi mở kinh mạch {meridian}. Tỷ lệ thành công: {chance}%. Tiêu thụ {qi} khí.',
      meridianBreakthroughAttempt: '🔥 Thử đột phá kinh mạch {meridian}. Chi phí: {qi} khí. Tỷ lệ thành công: {chance}%',
      meridianBreakthroughSuccess: '🎉 Đột phá kinh mạch thành công! {meridian} độ tinh khiết tăng từ {oldPurity}% lên {newPurity}%. Tiêu thụ {qi} khí.',
      meridianBreakthroughStageAdvanced: '⭐ {meridian} cấp độ đột phá tăng từ {oldStage} lên {newStage}!',
      meridianBreakthroughFailed: '💔 Đột phá kinh mạch thất bại. {meridian} độ tinh khiết giảm {purityLoss}%. Tiêu thụ {qi} khí.',
      meridianBreakthroughNotEnoughQi: '❌ Không đủ khí để đột phá kinh mạch. Cần: {qi} khí.',
      meridianBreakthroughNotOpen: '❌ Không thể đột phá {meridian} - kinh mạch chưa mở.',
      meridianBreakthroughNotReady: '❌ Không thể đột phá {meridian} - cần đạt {required}% độ tinh khiết trước.',
      meridianBreakthroughAlreadyPerfect: '✨ {meridian} đã đạt độ tinh khiết hoàn hảo.',
      meridianBreakthroughInvalidIndex: '❌ Chỉ số kinh mạch không hợp lệ.',
      breakthroughAttempt: '⚡ Đang thử đột phá lên {realm}...',
      breakthroughSuccess: '🎉 Đột phá thành công! Đạt {realm}!',
      breakthroughFailed: '💔 Đột phá thất bại. Nhận được hiểu biết tu luyện.',
      breakthroughRequirements: '📋 Yêu cầu đột phá {realm}:',
      breakthroughQiRequirement: '   💎 Khí: {current}/{required} {status}',
      breakthroughMeridianRequirement: '   🫀 Kinh Mạch Đã Mở: {current}/{required} {status}',
      breakthroughPurifiedMeridianRequirement: '   🫀 Kinh Mạch Tinh Lọc (80%+): {current}/{required} {status}',
      breakthroughHighlyPurifiedMeridianRequirement: '   🫀 Kinh Mạch Cao Cấp Tinh Lọc (95%+): {current}/{required} {status}',
      breakthroughPerfectMeridianRequirement: '   🫀 Kinh Mạch Hoàn Hảo (100%): {current}/{required} {status}',
      breakthroughElementRequirement: '   🌟 Ngũ Hành Đã Tu Luyện Đầy Đủ: {current}/{required} {status}',
      breakthroughAllElementsRequirement: '   🌟 Toàn Bộ Ngũ Hành Thông Thuợ: {current}/{required} {status}',
      breakthroughDivineElementsRequirement: '   🌟 Ngũ Hành Thần Linh: {current}/{required} {status}',
      breakthroughRequirementsMet: '🎯 Đủ yêu cầu! Đối mặt với kiếp nạn {tribulation}...',
      breakthroughRequirementsNotMet: '❌ Chưa đủ yêu cầu đột phá. Tiếp tục tu luyện!',
      reincarnation: '🔄 Đang tái sinh...',
      lifetimeSummary: '📈 Tóm Tắt Tuổi Thọ:',
      totalQiGathered: 'Tổng Khí Thu Thập: {qi}',
      maxRealmAchieved: 'Cảnh Giới Cao Nhất: {realm}',
      karmicBalance: 'Cân Bằng Nghiệp Lực: {karma}',
      cultivationInsights: 'Hiểu Biết Tu Luyện: {insights}',
      artifactsPreserved: 'Pháp Bảo Giữ Lại: {artifacts}',
      newLifeBegins: '🌱 Cuộc đời mới bắt đầu...',
      randomEvent: '🎲 Sự Kiện Ngẫu Nhiên: {event}',
      fortuitousEncounter: '✨ Gặp gỡ một bậc thầy bí ẩn! Tài năng tăng {talent} điểm.',
      tribulationChallengeSuccess: '⚡ Vượt qua kiếp nạn nhỏ! Nhận được {insights} hiểu biết về kiếp nạn.',
      tribulationChallengeFailure: '💥 Thất bại trong thử thách kiếp nạn! Mất {qi} khí.',
      karmicReward: '🙏 Làm một việc thiện! Cân bằng nghiệp lực tăng {karma} điểm.',
      enemyEncounter: '👹 Gặp {enemy} (Cảnh Giới: {realm}, Khí: {qi}/{maxQi})',
      enemyDefeated: '✅ Đánh bại {enemy}!',
      enemyDefeatedBy: '❌ Bị {enemy} đánh bại! Mất {damage} khí.',
      tribulationStart: '⚡ Thiên Kiếp: {type}! Tỷ lệ thành công: {rate}%',
      tribulationSuccess: '✨ Vượt qua kiếp nạn! Đột phá thành công!',
      breakthroughAdvanced: '🚀 Đột phá thành công! Tiến lên cảnh giới {realm}!',
      maxQiIncreased: '💎 Khí tối đa tăng lên {maxQi}',
      elementCultivationEnabled: '🌟 Ngũ hành mới có thể tu luyện: {elements}',
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

  /**
   * Get element name
   */
  getElementName(element: number): string {
    const elementNames = {
      0: 'elements.metal',
      1: 'elements.wood',
      2: 'elements.water',
      3: 'elements.fire',
      4: 'elements.earth',
    };

    return this.t(elementNames[element as keyof typeof elementNames] || 'elements.metal');
  }
}

// Global i18n instance
export const i18n = new I18n();