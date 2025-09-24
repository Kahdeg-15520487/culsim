/**
 * BreakthroughSystem - Handles realm breakthroughs and tribulation mechan    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet', { tribulation: 'heavenly' }));
      this.performTribulation('lightning', TRIBULATION_SUCCESS_RATES[CultivationRealm.Mortal], () => {
        this.performBreakthrough(CultivationRealm.QiCondensation);
      });
    } else {
      console.log(i18n.t('messages.breakthroughRequirementsNotMet'));
    }
 * Manages the advancement between cultivation realms, breakthrough requirements,
 * and tribulation challenges that must be overcome.
 */

import { GameState, CultivationRealm, Element } from '../../types';
import { Random } from '../../utils/Random';
import { i18n } from '../../utils/i18n';
import { BREAKTHROUGH_REQUIREMENTS, BREAKTHROUGH_EFFECTS, PURITY_THRESHOLDS, TRIBULATION_SUCCESS_RATES } from '../constants';

export class BreakthroughSystem {
  constructor(private gameState: GameState, private random: Random) {}

  /**
   * Attempt breakthrough to next realm
   */
  public attemptBreakthrough(): void {
    const player = this.gameState.player;

    console.log(i18n.t('messages.breakthroughAttempt', { realm: this.getRealmName(player.realm) }));

    switch (player.realm) {
      case CultivationRealm.Mortal:
        this.attemptMortalBreakthrough();
        break;
      case CultivationRealm.QiCondensation:
        this.attemptQiCondensationBreakthrough();
        break;
      case CultivationRealm.FoundationEstablishment:
        this.attemptFoundationEstablishmentBreakthrough();
        break;
      case CultivationRealm.CoreFormation:
        this.attemptCoreFormationBreakthrough();
        break;
      case CultivationRealm.NascentSoul:
        this.attemptNascentSoulBreakthrough();
        break;
      case CultivationRealm.DivineTransformation:
        this.attemptDivineTransformationBreakthrough();
        break;
      case CultivationRealm.VoidRefinement:
        this.attemptVoidRefinementBreakthrough();
        break;
      default:
        console.log(i18n.t('messages.breakthroughMaxRealm'));
    }
  }

  /**
   * Attempt breakthrough from Mortal to Qi Condensation
   */
  private attemptMortalBreakthrough(): void {
    const player = this.gameState.player;

    const qiRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.Mortal].qi;
    const meridianRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.Mortal].meridians;
    const elementRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.Mortal].elements;
    const openMeridians = player.meridians.filter(m => m.isOpen).length;
    const fullyCultivatedElements = Object.values(player.elements).filter(affinity => affinity >= 100).length;

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.QiCondensation) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', {
      current: player.qi.toFixed(1),
      required: qiRequirement,
      status: player.qi >= qiRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughMeridianRequirement', {
      current: openMeridians,
      required: meridianRequirement,
      status: openMeridians >= meridianRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughElementRequirement', {
      current: fullyCultivatedElements,
      required: elementRequirement,
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌'
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet'));
      this.performTribulation('lightning', TRIBULATION_SUCCESS_RATES[CultivationRealm.Mortal], () => {
        this.performBreakthrough(CultivationRealm.QiCondensation);
      });
    } else {
      console.log(i18n.t('messages.breakthroughFailed'));
    }
  }

  /**
   * Attempt breakthrough from Qi Condensation to Foundation Establishment
   */
  private attemptQiCondensationBreakthrough(): void {
    const player = this.gameState.player;

    const qiRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.QiCondensation].qi;
    const meridianRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.QiCondensation].meridians;
    const elementRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.QiCondensation].elements;
    const openMeridians = player.meridians.filter(m => m.isOpen).length;

    const primaryElement = this.getPrimaryElement();
    let fullyCultivatedElements = 0;
    if (primaryElement) {
      const complementaryElements = this.getComplementaryElements(primaryElement, CultivationRealm.QiCondensation);
      const allElementsToCheck = [primaryElement, ...complementaryElements];
      fullyCultivatedElements = allElementsToCheck.filter(element => player.elements[element] >= 100).length;
    }

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.FoundationEstablishment) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', {
      current: player.qi.toFixed(1),
      required: qiRequirement,
      status: player.qi >= qiRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughMeridianRequirement', {
      current: openMeridians,
      required: meridianRequirement,
      status: openMeridians >= meridianRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughElementRequirement', {
      current: fullyCultivatedElements,
      required: elementRequirement,
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌'
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      this.performTribulation('lightning', TRIBULATION_SUCCESS_RATES[CultivationRealm.QiCondensation], () => {
        this.performBreakthrough(CultivationRealm.FoundationEstablishment);
      });
    } else {
      console.log(i18n.t('messages.breakthroughFailed'));
    }
  }

  /**
   * Attempt breakthrough from Foundation Establishment to Core Formation
   */
  private attemptFoundationEstablishmentBreakthrough(): void {
    const player = this.gameState.player;

    const qiRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.FoundationEstablishment].qi;
    const meridianRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.FoundationEstablishment].meridians;
    const elementRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.FoundationEstablishment].elements;
    const openMeridians = player.meridians.filter(m => m.isOpen).length;

    const primaryElement = this.getPrimaryElement();
    let fullyCultivatedElements = 0;
    if (primaryElement) {
      const complementaryElements = this.getComplementaryElements(primaryElement, CultivationRealm.FoundationEstablishment);
      const allElementsToCheck = [primaryElement, ...complementaryElements];
      fullyCultivatedElements = allElementsToCheck.filter(element => player.elements[element] >= 100).length;
    }

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.CoreFormation) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', {
      current: player.qi.toFixed(1),
      required: qiRequirement,
      status: player.qi >= qiRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughMeridianRequirement', {
      current: openMeridians,
      required: meridianRequirement,
      status: openMeridians >= meridianRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughElementRequirement', {
      current: fullyCultivatedElements,
      required: elementRequirement,
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌'
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      this.performTribulation('lightning', TRIBULATION_SUCCESS_RATES[CultivationRealm.FoundationEstablishment], () => {
        this.performBreakthrough(CultivationRealm.CoreFormation);
      });
    } else {
      console.log(i18n.t('messages.breakthroughFailed'));
    }
  }

  /**
   * Attempt breakthrough from Core Formation to Nascent Soul
   */
  private attemptCoreFormationBreakthrough(): void {
    const player = this.gameState.player;

    const qiRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.CoreFormation].qi;
    const meridianRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.CoreFormation].meridians;
    const elementRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.CoreFormation].elements;
    const openMeridians = player.meridians.filter(m => m.isOpen && m.purity >= PURITY_THRESHOLDS.PURIFIED).length;

    const primaryElement = this.getPrimaryElement();
    let fullyCultivatedElements = 0;
    if (primaryElement) {
      const complementaryElements = this.getComplementaryElements(primaryElement, CultivationRealm.CoreFormation);
      const allElementsToCheck = [primaryElement, ...complementaryElements];
      fullyCultivatedElements = allElementsToCheck.filter(element => player.elements[element] >= 100).length;
    }

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.NascentSoul) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', {
      current: player.qi.toFixed(1),
      required: qiRequirement,
      status: player.qi >= qiRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughPurifiedMeridianRequirement', {
      current: openMeridians,
      required: meridianRequirement,
      status: openMeridians >= meridianRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughElementRequirement', {
      current: fullyCultivatedElements,
      required: elementRequirement,
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌'
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      this.performTribulation('heart_demon', TRIBULATION_SUCCESS_RATES[CultivationRealm.CoreFormation], () => {
        this.performBreakthrough(CultivationRealm.NascentSoul);
      });
    } else {
      console.log(i18n.t('messages.breakthroughFailed'));
    }
  }

  /**
   * Attempt breakthrough from Nascent Soul to Divine Transformation
   */
  private attemptNascentSoulBreakthrough(): void {
    const player = this.gameState.player;

    const qiRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.NascentSoul].qi;
    const meridianRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.NascentSoul].meridians;
    const elementRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.NascentSoul].elements;
    const openMeridians = player.meridians.filter(m => m.isOpen && m.purity >= PURITY_THRESHOLDS.HIGHLY_PURIFIED).length;
    const fullyCultivatedElements = Object.values(player.elements).filter(affinity => affinity >= 100).length;

    console.log(i18n.t('messages.breakthroughRequirements', { realm: this.getRealmName(CultivationRealm.DivineTransformation) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', {
      current: player.qi.toFixed(1),
      required: qiRequirement,
      status: player.qi >= qiRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughHighlyPurifiedMeridianRequirement', {
      current: openMeridians,
      required: meridianRequirement,
      status: openMeridians >= meridianRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughAllElementsRequirement', {
      current: fullyCultivatedElements,
      required: elementRequirement,
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌'
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      this.performTribulation('elemental', TRIBULATION_SUCCESS_RATES[CultivationRealm.NascentSoul], () => {
        this.performBreakthrough(CultivationRealm.DivineTransformation);
      });
    } else {
      console.log(i18n.t('messages.breakthroughFailed'));
    }
  }

  /**
   * Attempt breakthrough from Divine Transformation to Void Refinement
   */
  private attemptDivineTransformationBreakthrough(): void {
    const player = this.gameState.player;

    const qiRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.DivineTransformation].qi;
    const meridianRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.DivineTransformation].meridians;
    const elementRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.DivineTransformation].elements;
    const openMeridians = player.meridians.filter(m => m.isOpen && m.purity >= PURITY_THRESHOLDS.PERFECT).length;
    const fullyCultivatedElements = Object.values(player.elements).filter(affinity => affinity >= 100).length;

    console.log(i18n.t('messages.breakthroughRequirements', { realm: this.getRealmName(CultivationRealm.VoidRefinement) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', {
      current: player.qi.toFixed(1),
      required: qiRequirement,
      status: player.qi >= qiRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughPerfectMeridianRequirement', {
      current: openMeridians,
      required: meridianRequirement,
      status: openMeridians >= meridianRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughDivineElementsRequirement', {
      current: fullyCultivatedElements,
      required: elementRequirement,
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌'
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      this.performTribulation('karmic', TRIBULATION_SUCCESS_RATES[CultivationRealm.DivineTransformation], () => {
        this.performBreakthrough(CultivationRealm.VoidRefinement);
      });
    } else {
      console.log(i18n.t('messages.breakthroughFailed'));
    }
  }

  /**
   * Attempt breakthrough from Void Refinement to Immortal Ascension
   */
  private attemptVoidRefinementBreakthrough(): void {
    const player = this.gameState.player;

    const qiRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.VoidRefinement].qi;
    const meridianRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.VoidRefinement].meridians;
    const elementRequirement = BREAKTHROUGH_REQUIREMENTS[CultivationRealm.VoidRefinement].elements;
    const openMeridians = player.meridians.filter(m => m.isOpen && m.purity >= PURITY_THRESHOLDS.PERFECT).length;
    const fullyCultivatedElements = Object.values(player.elements).filter(affinity => affinity >= 100).length;

    console.log(i18n.t('messages.breakthroughRequirements', { realm: this.getRealmName(CultivationRealm.ImmortalAscension) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', {
      current: player.qi.toFixed(1),
      required: qiRequirement,
      status: player.qi >= qiRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughPerfectMeridianRequirement', {
      current: openMeridians,
      required: meridianRequirement,
      status: openMeridians >= meridianRequirement ? '✅' : '❌'
    }));
    console.log(i18n.t('messages.breakthroughDivineElementsRequirement', {
      current: fullyCultivatedElements,
      required: elementRequirement,
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌'
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      this.performTribulation('karmic', TRIBULATION_SUCCESS_RATES[CultivationRealm.VoidRefinement], () => {
        this.performBreakthrough(CultivationRealm.ImmortalAscension);
      });
    } else {
      console.log(i18n.t('messages.breakthroughFailed'));
    }
  }

  /**
   * Perform a cultivation realm breakthrough
   */
  private performBreakthrough(newRealm: CultivationRealm): void {
    const player = this.gameState.player;
    const oldRealm = player.realm;

    player.realm = newRealm;
    player.maxQi *= BREAKTHROUGH_EFFECTS.MAX_QI_MULTIPLIER;
    player.qi = Math.max(BREAKTHROUGH_EFFECTS.MIN_QI_RETAINED, player.qi * BREAKTHROUGH_EFFECTS.QI_RETENTION_PERCENTAGE);

    this.enableComplementaryElementCultivation(newRealm);

    this.gameState.soul.cultivationInsights.realmBreakthroughs.push(oldRealm);
    if (newRealm > this.gameState.soul.maxRealmAchieved) {
      this.gameState.soul.maxRealmAchieved = newRealm;
    }

    console.log(i18n.t('messages.breakthroughAdvanced', { realm: this.getRealmName(newRealm) }));
    console.log(i18n.t('messages.maxQiIncreased', { maxQi: player.maxQi }));
  }

  /**
   * Enable cultivation of complementary elements based on realm breakthrough
   */
  private enableComplementaryElementCultivation(newRealm: CultivationRealm): void {
    const player = this.gameState.player;
    const primaryElement = this.getPrimaryElement();

    if (!primaryElement) return;

    const oldComplementaryElements = this.getComplementaryElements(primaryElement, player.realm - 1);
    const newComplementaryElements = this.getComplementaryElements(primaryElement, newRealm);

    const newlyUnlockedElements = newComplementaryElements.filter(
      element => !oldComplementaryElements.includes(element)
    );

    if (newlyUnlockedElements.length > 0) {
      console.log(i18n.t('messages.newElementsUnlocked', {
        elements: newlyUnlockedElements.join(', ')
      }));
    }
  }

  /**
   * Perform a heavenly tribulation for realm breakthrough
   */
  private performTribulation(type: 'lightning' | 'heart_demon' | 'elemental' | 'karmic', baseSuccessRate: number, onSuccess: () => void): void {
    const player = this.gameState.player;
    const soul = this.gameState.soul;

    let successRate = baseSuccessRate;

    const primaryElement = this.getPrimaryElement();
    if (primaryElement && type === 'elemental') {
      successRate += player.elements[primaryElement] / 1000;
    }

    successRate += player.talent / 1000;

    if (type === 'karmic' || type === 'heart_demon') {
      successRate += (soul.karmicBalance > 0 ? soul.karmicBalance : soul.karmicBalance * 2) / 1000;
    }

    console.log(i18n.t('messages.tribulationStart', {
      type: type.toUpperCase(),
      rate: (successRate * 100).toFixed(1)
    }));

    if (this.random.chance(successRate)) {
      console.log(i18n.t('messages.tribulationSuccess'));
      soul.cultivationInsights.tribulationSurvivals++;
      onSuccess();
    } else {
      console.log(i18n.t('messages.tribulationFailed'));
      this.handleTribulationFailure(type);
    }
  }

  /**
   * Handle tribulation failure consequences
   */
  private handleTribulationFailure(type: 'lightning' | 'heart_demon' | 'elemental' | 'karmic'): void {
    const player = this.gameState.player;

    switch (type) {
      case 'lightning':
        const qiLoss = player.qi * 0.5;
        player.qi = Math.max(0, player.qi - qiLoss);
        console.log(i18n.t('messages.tribulationLightningFailure', { qiLoss: qiLoss.toFixed(1) }));
        break;

      case 'heart_demon':
        const cultivationRegression = Math.min(2, player.realm);
        if (cultivationRegression > 0) {
          player.realm -= cultivationRegression;
          player.maxQi /= Math.pow(BREAKTHROUGH_EFFECTS.MAX_QI_MULTIPLIER, cultivationRegression);
          console.log(i18n.t('messages.tribulationHeartDemonFailure', { realms: cultivationRegression }));
        }
        break;

      case 'elemental':
        const primaryElement = this.getPrimaryElement();
        if (primaryElement) {
          const affinityLoss = player.elements[primaryElement] * 0.3;
          player.elements[primaryElement] = Math.max(0, player.elements[primaryElement] - affinityLoss);
          console.log(i18n.t('messages.tribulationElementalFailure', {
            element: primaryElement,
            affinityLoss: affinityLoss.toFixed(1)
          }));
        }
        break;

      case 'karmic':
        this.gameState.soul.karmicBalance -= 50;
        console.log(i18n.t('messages.tribulationKarmicFailure'));
        break;
    }
  }

  /**
   * Get human-readable realm name
   */
  private getRealmName(realm: CultivationRealm): string {
    return i18n.getRealmName(realm);
  }

  /**
   * Get the player's primary element
   */
  private getPrimaryElement(): Element | null {
    const elements = this.gameState.player.elements;
    let maxAffinity = 0;
    let primaryElement: Element | null = null;

    Object.entries(elements).forEach(([element, affinity]) => {
      if (affinity > maxAffinity) {
        maxAffinity = affinity;
        primaryElement = element as Element;
      }
    });

    return primaryElement;
  }

  /**
   * Get complementary elements based on primary element and realm
   */
  private getComplementaryElements(primaryElement: Element, realm: CultivationRealm): Element[] {
    const complementary: Element[] = [];

    const generatingCycle: Record<Element, Element> = {
      [Element.Wood]: Element.Fire,
      [Element.Fire]: Element.Earth,
      [Element.Earth]: Element.Metal,
      [Element.Metal]: Element.Water,
      [Element.Water]: Element.Wood
    };

    const controllingCycle: Record<Element, Element> = {
      [Element.Wood]: Element.Earth,
      [Element.Earth]: Element.Water,
      [Element.Water]: Element.Fire,
      [Element.Fire]: Element.Metal,
      [Element.Metal]: Element.Wood
    };

    if (realm >= CultivationRealm.QiCondensation) {
      complementary.push(generatingCycle[primaryElement]);
    }

    if (realm >= CultivationRealm.CoreFormation) {
      complementary.push(controllingCycle[primaryElement]);
    }

    if (realm >= CultivationRealm.DivineTransformation) {
      const controller = controllingCycle[primaryElement];
      const counterController = Object.entries(controllingCycle).find(([_, controlled]) => controlled === controller)?.[0] as Element;
      if (counterController) {
        complementary.push(counterController);
      }
    }

    return complementary;
  }
}