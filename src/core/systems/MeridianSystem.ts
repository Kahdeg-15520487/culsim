/**
 * MeridianSystem - Handles meridian opening, breakthroughs, and purification
 *
 * Manages the 12 major meridians, their opening, breakthrough stages, and purity levels.
 */

import { GameState, Meridian } from '../../types';
import { Random } from '../../utils/Random';
import { i18n } from '../../utils/i18n';
import { MERIDIAN_CONSTANTS, PURITY_THRESHOLDS, MERIDIAN_BREAKTHROUGH } from '../constants';

export class MeridianSystem {
  constructor(private gameState: GameState, private random: Random) {}

  /**
   * Attempt to open meridians based on current cultivation
   */
  public attemptMeridianOpening(specificIndex?: number): void {
    const player = this.gameState.player;
    const closedMeridians = player.meridians
      .map((meridian, index) => ({ meridian, index }))
      .filter(({ meridian }) => !meridian.isOpen);

    if (closedMeridians.length === 0) return;

    const target = specificIndex !== undefined && specificIndex < player.meridians.length
      ? { meridian: player.meridians[specificIndex], index: specificIndex }
      : this.random.choice(closedMeridians);

    const qiRequirement = MERIDIAN_CONSTANTS.OPENING_BASE_COST + (target.index * MERIDIAN_CONSTANTS.OPENING_COST_INCREMENT);
    const talentBonus = player.talent / 200;
    const successChance = Math.min(0.8, (player.qi / qiRequirement) * (0.5 + talentBonus));

    const qiCost = Math.floor(qiRequirement * MERIDIAN_CONSTANTS.OPENING_ATTEMPT_COST_FRACTION);
    player.qi = Math.max(0, player.qi - qiCost);

    if (this.random.chance(successChance)) {
      player.meridians[target.index].isOpen = true;
      player.meridians[target.index].purity = MERIDIAN_CONSTANTS.INITIAL_PURITY;
      console.log(i18n.t('messages.meridianOpened', {
        meridian: i18n.getMeridianName(target.index)
      }));
    } else {
      console.log(i18n.t('messages.meridianOpeningFailed', {
        meridian: i18n.getMeridianName(target.index),
        chance: (successChance * 100).toFixed(1)
      }));
    }
  }

  /**
   * Attempt meridian breakthrough to increase purity beyond natural cap
   */
  public attemptMeridianBreakthrough(meridianIndex: number): void {
    const player = this.gameState.player;

    if (meridianIndex < 0 || meridianIndex >= player.meridians.length) {
      console.log(i18n.t('messages.invalidMeridianIndex'));
      return;
    }

    const meridian = player.meridians[meridianIndex];

    if (!meridian.isOpen) {
      console.log(i18n.t('messages.meridianNotOpen', {
        meridian: i18n.getMeridianName(meridianIndex)
      }));
      return;
    }

    // Check if meridian has sufficient purity for next breakthrough
    const requiredPurity = this.getMeridianEffectiveCap(meridian);
    if (meridian.purity < requiredPurity) {
      console.log(i18n.t('messages.meridianNotPurified', {
        meridian: i18n.getMeridianName(meridianIndex),
        purity: meridian.purity.toFixed(1),
        required: requiredPurity
      }));
      return;
    }

    if (meridian.purity >= MERIDIAN_CONSTANTS.MAX_PURITY) {
      console.log(i18n.t('messages.meridianMaxPurity', {
        meridian: i18n.getMeridianName(meridianIndex)
      }));
      return;
    }

    const baseQiCost = (meridianIndex + 1) * MERIDIAN_BREAKTHROUGH.QI_COST_MULTIPLIER;
    const stageMultiplier = 1 + (meridian.breakthroughStage * 10);
    const qiCost = baseQiCost * stageMultiplier;
    const baseChance = MERIDIAN_BREAKTHROUGH.BASE_SUCCESS_CHANCE;
    const talentBonus = player.talent / MERIDIAN_BREAKTHROUGH.TALENT_BONUS_DIVISOR;
    const successChance = Math.min(0.95, baseChance + talentBonus);

    console.log(i18n.t('messages.meridianBreakthroughAttempt', {
      meridian: i18n.getMeridianName(meridianIndex),
      qi: qiCost,
      chance: (successChance * 100).toFixed(1)
    }));

    if (player.qi < qiCost) {
      console.log(i18n.t('messages.insufficientQi', {
        required: qiCost,
        current: player.qi.toFixed(1)
      }));
      return;
    }

    const attemptCost = Math.floor(qiCost * MERIDIAN_BREAKTHROUGH.ATTEMPT_COST_FRACTION);
    player.qi = Math.max(0, player.qi - attemptCost);

    if (this.random.chance(successChance)) {
      meridian.breakthroughStage += 1;
      const newCap = this.getMeridianEffectiveCap(meridian);

      console.log(i18n.t('messages.meridianBreakthroughSuccess', {
        meridian: i18n.getMeridianName(meridianIndex),
        stage: meridian.breakthroughStage,
        cap: newCap
      }));

      if (this.random.chance(MERIDIAN_BREAKTHROUGH.HEART_DEMON_CHANCE)) {
        console.log(i18n.t('messages.heartDemonTribulation'));
        if (this.random.chance(0.3)) {
          console.log(i18n.t('messages.heartDemonSuccess'));
        } else {
          const qiLoss = player.qi * MERIDIAN_BREAKTHROUGH.HEART_DEMON_QI_LOSS;
          player.qi = Math.max(0, player.qi - qiLoss);
          console.log(i18n.t('messages.heartDemonFailure', {
            qiLoss: qiLoss.toFixed(1)
          }));
        }
      }
    } else {
      console.log(i18n.t('messages.meridianBreakthroughFailed', {
        meridian: i18n.getMeridianName(meridianIndex)
      }));

      if (this.random.chance(MERIDIAN_BREAKTHROUGH.FAILURE_DAMAGE_CHANCE)) {
        const damage = meridian.purity * MERIDIAN_BREAKTHROUGH.FAILURE_DAMAGE_PERCENTAGE;
        meridian.purity = Math.max(0, meridian.purity - damage);
        console.log(i18n.t('messages.meridianBreakthroughDamage', {
          meridian: i18n.getMeridianName(meridianIndex),
          damage: damage.toFixed(1),
          purity: meridian.purity.toFixed(1)
        }));
      }
    }
  }

  /**
   * Get the effective purity cap for a meridian based on its breakthrough stage
   */
  public getMeridianEffectiveCap(meridian: Meridian): number {
    switch (meridian.breakthroughStage) {
      case 0: return PURITY_THRESHOLDS.NATURAL_CAP; // 50%
      case 1: return PURITY_THRESHOLDS.PURIFIED; // 80%
      case 2: return PURITY_THRESHOLDS.HIGHLY_PURIFIED; // 95%
      case 3: return PURITY_THRESHOLDS.PERFECT; // 100%
      default: return PURITY_THRESHOLDS.NATURAL_CAP;
    }
  }

  /**
   * Get meridian information for UI display
   */
  public getMeridianInfo(index: number): Meridian | null {
    if (index < 0 || index >= this.gameState.player.meridians.length) {
      return null;
    }
    return this.gameState.player.meridians[index];
  }

  /**
   * Get all meridians information
   */
  public getAllMeridians(): Meridian[] {
    return [...this.gameState.player.meridians];
  }

  /**
   * Check if a meridian can be opened
   */
  public canOpenMeridian(index: number): boolean {
    if (index < 0 || index >= this.gameState.player.meridians.length) {
      return false;
    }
    return !this.gameState.player.meridians[index].isOpen;
  }

  /**
   * Check if a meridian can attempt breakthrough
   */
  public canBreakthroughMeridian(index: number): boolean {
    if (index < 0 || index >= this.gameState.player.meridians.length) {
      return false;
    }

    const meridian = this.gameState.player.meridians[index];
    if (!meridian.isOpen) return false;
    if (meridian.purity < PURITY_THRESHOLDS.NATURAL_CAP) return false;
    if (meridian.purity >= MERIDIAN_CONSTANTS.MAX_PURITY) return false;

    return true;
  }

  /**
   * Debug method - add meridian progress
   */
  public debugAddMeridianProgress(amount: number): void {
    const player = this.gameState.player;
    let modifiedCount = 0;

    player.meridians.forEach((meridian) => {
      if (meridian.isOpen) {
        const effectiveCap = this.getMeridianEffectiveCap(meridian);
        if (meridian.purity < effectiveCap) {
          const oldPurity = meridian.purity;
          meridian.purity = Math.min(effectiveCap, meridian.purity + amount);
          modifiedCount++;
          console.log(`🐛 Debug: Meridian purified from ${oldPurity.toFixed(1)}% to ${meridian.purity.toFixed(1)}% (cap: ${effectiveCap}%)`);
        }
      }
    });
  }
}