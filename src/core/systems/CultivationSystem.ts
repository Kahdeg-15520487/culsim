/**
 * CultivationSystem - Handles cultivation mechanics and qi gathering
 *
 * Manages realm-specific cultivation, qi absorption, and cultivation progression.
 */

import { GameState, CultivationRealm, Element, Meridian } from '../../types';
import { CULTIVATION_RATES, REALM_QI_GATHERING, MULTIPLIERS, PURITY_THRESHOLDS, MERIDIAN_CONSTANTS, TALENT_DIVISORS } from '../constants';

export class CultivationSystem {
  constructor(private gameState: GameState) {}

  /**
   * Process cultivation mechanics based on current realm
   */
  public processCultivation(): void {
    const player = this.gameState.player;

    // Process meridian purification
    this.processMeridianPurification();

    switch (player.realm) {
      case CultivationRealm.Mortal:
        this.cultivateMortalRealm();
        break;
      case CultivationRealm.QiCondensation:
        this.cultivateQiCondensationRealm();
        break;
      case CultivationRealm.FoundationEstablishment:
        this.cultivateFoundationEstablishmentRealm();
        break;
      case CultivationRealm.CoreFormation:
        this.cultivateCoreFormationRealm();
        break;
      case CultivationRealm.NascentSoul:
        this.cultivateNascentSoulRealm();
        break;
      case CultivationRealm.DivineTransformation:
        this.cultivateDivineTransformationRealm();
        break;
      case CultivationRealm.VoidRefinement:
        this.cultivateVoidRefinementRealm();
        break;
      case CultivationRealm.ImmortalAscension:
        this.cultivateImmortalAscensionRealm();
        break;
    }
  }

  /**
   * Mortal realm cultivation - sensing and absorbing ambient qi
   */
  private cultivateMortalRealm(): void {
    const player = this.gameState.player;

    const qiGain = this.calculateQiGatheringForRealm(CultivationRealm.Mortal);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Element cultivation - basic awareness
    this.cultivateElements();
  }

  /**
   * Qi Condensation realm - condensing qi into dantian
   */
  private cultivateQiCondensationRealm(): void {
    const player = this.gameState.player;

    const qiGain = this.calculateQiGatheringForRealm(CultivationRealm.QiCondensation);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    this.cultivateElements();
  }

  /**
   * Foundation Establishment realm - forming qi vortex
   */
  private cultivateFoundationEstablishmentRealm(): void {
    const player = this.gameState.player;

    const qiGain = this.calculateQiGatheringForRealm(CultivationRealm.FoundationEstablishment);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    this.cultivateElements();
  }

  /**
   * Core Formation realm cultivation - compressing qi into a solid core
   */
  private cultivateCoreFormationRealm(): void {
    const player = this.gameState.player;

    const qiGain = this.calculateQiGatheringForRealm(CultivationRealm.CoreFormation);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    this.cultivateElements();
  }

  /**
   * Nascent Soul realm cultivation - soul separation and projection
   */
  private cultivateNascentSoulRealm(): void {
    const player = this.gameState.player;

    const qiGain = this.calculateQiGatheringForRealm(CultivationRealm.NascentSoul);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    this.cultivateElements();
  }

  /**
   * Divine Transformation realm cultivation - divine energies and laws
   */
  private cultivateDivineTransformationRealm(): void {
    const player = this.gameState.player;

    const qiGain = this.calculateQiGatheringForRealm(CultivationRealm.DivineTransformation);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    this.cultivateElements();
  }

  /**
   * Void Refinement realm cultivation - void laws and karmic alignment
   */
  private cultivateVoidRefinementRealm(): void {
    const player = this.gameState.player;

    const qiGain = this.calculateQiGatheringForRealm(CultivationRealm.VoidRefinement);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    this.cultivateElements();
  }

  /**
   * Immortal Ascension realm cultivation - transcending mortal limits
   */
  private cultivateImmortalAscensionRealm(): void {
    const player = this.gameState.player;

    const qiGain = this.calculateQiGatheringForRealm(CultivationRealm.ImmortalAscension);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    this.cultivateElements();
  }

  /**
   * Calculate qi gathering rate for a specific realm
   */
  private calculateQiGatheringForRealm(realm: CultivationRealm): number {
    const player = this.gameState.player;

    if (realm === CultivationRealm.Mortal) {
      const basicAbsorption = REALM_QI_GATHERING[CultivationRealm.Mortal].BASIC_ABSORPTION;
      const talentMultiplier = 1 + (player.talent / 500);
      let qiGain = basicAbsorption * talentMultiplier;

      const openMeridians = player.meridians.filter(m => m.isOpen).length;
      if (openMeridians > 0) {
        const meridianBonus = openMeridians * 0.5;
        qiGain *= (1 + meridianBonus);
      }

      return qiGain;
    } else {
      const realmConfig = REALM_QI_GATHERING[realm];
      const baseAbsorption = realmConfig.BASE_ABSORPTION;

      const talentMultiplier = 1 + (player.talent / TALENT_DIVISORS[realm]);
      const meridianBonus = this.calculateMeridianBonus();
      const realmMultiplier = (realmConfig as any).REALM_MULTIPLIER || 1;

      let karmicBonus = 1;
      if (realm === CultivationRealm.VoidRefinement) {
        karmicBonus = 1 + (this.gameState.soul.karmicBalance / 1000);
      } else if (realm === CultivationRealm.ImmortalAscension) {
        karmicBonus = 1 + (this.gameState.soul.karmicBalance / 500);
      }

      return baseAbsorption * talentMultiplier * meridianBonus * realmMultiplier * karmicBonus;
    }
  }

  /**
   * Calculate cultivation bonus from open meridians
   */
  private calculateMeridianBonus(): number {
    const player = this.gameState.player;
    const openMeridians = player.meridians.filter(m => m.isOpen);

    if (openMeridians.length === 0) return 1;

    const baseBonus = openMeridians.length * 0.1;
    const purityBonus = openMeridians.reduce((sum, m) => sum + (m.purity / 1000), 0);

    return 1 + baseBonus * 2 + purityBonus * 4;
  }

  /**
   * Cultivate elemental affinities based on current realm and element cycle
   */
  private cultivateElements(): void {
    const player = this.gameState.player;
    const realm = player.realm;

    const baseGrowth = 0.1 + (player.talent / 1000);

    // Find primary element (highest affinity)
    const primaryElement = this.getPrimaryElement();

    if (primaryElement) {
      player.elements[primaryElement] = Math.min(100, player.elements[primaryElement] + baseGrowth);

      const complementaryElements = this.getComplementaryElements(primaryElement, realm);
      complementaryElements.forEach(element => {
        player.elements[element] = Math.min(100, player.elements[element] + baseGrowth * 0.5);
      });
    }
  }

  /**
   * Get the player's primary element (highest affinity)
   */
  public getPrimaryElement(): Element | null {
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
  public getComplementaryElements(primaryElement: Element, realm: CultivationRealm): Element[] {
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

  /**
   * Process meridian purification and enhancement
   */
  private processMeridianPurification(): void {
    const player = this.gameState.player;

    player.meridians.forEach((meridian, index) => {
      if (!meridian.isOpen) return;

      const effectiveCap = this.getMeridianEffectiveCap(meridian);
      if (meridian.purity >= effectiveCap) return;

      const purificationRate = CULTIVATION_RATES.BASE_MERIDIAN_PURIFICATION + (player.talent / 1000) + (meridian.breakthroughStage * 0.05);
      meridian.purity = Math.min(effectiveCap, meridian.purity + purificationRate);
    });
  }

  /**
   * Get the effective purity cap for a meridian based on its breakthrough stage
   */
  public getMeridianEffectiveCap(meridian: Meridian): number {
    switch (meridian.breakthroughStage) {
      case 0: return 25; // 25%
      case 1: return 80; // 80%
      case 2: return 95; // 95%
      case 3: return 100; // 100%
      default: return 100;
    }
  }

  /**
   * Manual cultivation - allows player to actively cultivate for immediate benefits
   */
  public cultivate(): number {
    const player = this.gameState.player;

    const manualBoost = 2.0;
    const qiGain = this.calculateQiGatheringForRealm(player.realm) * manualBoost;

    player.qi = Math.min(player.qi + qiGain, player.maxQi);
    this.cultivateElements();
    this.processMeridianPurification();

    return qiGain;
  }

  /**
   * Calculate current qi gathering speed in qi per day
   */
  public calculateQiGatheringSpeed(): number {
    const player = this.gameState.player;
    return this.calculateQiGatheringForRealm(player.realm);
  }
}