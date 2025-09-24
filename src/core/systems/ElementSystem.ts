/**
 * ElementSystem - Handles elemental affinities and interactions
 *
 * Manages the five elements (Metal, Wood, Water, Fire, Earth), their cultivation,
 * affinities, and interactions according to the five elements cycle.
 */

import { GameState, Element, ElementAffinities } from '../../types';
import { CULTIVATION_RATES } from '../constants';

export class ElementSystem {
  constructor(private gameState: GameState) {}

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
  public getComplementaryElements(primaryElement: Element, realm: import('../../types').CultivationRealm): Element[] {
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

    if (realm >= 1) { // QiCondensation
      complementary.push(generatingCycle[primaryElement]);
    }

    if (realm >= 3) { // CoreFormation
      complementary.push(controllingCycle[primaryElement]);
    }

    if (realm >= 5) { // DivineTransformation
      const controller = controllingCycle[primaryElement];
      const counterController = Object.entries(controllingCycle).find(([_, controlled]) => controlled === controller)?.[0] as Element;
      if (counterController) {
        complementary.push(counterController);
      }
    }

    return complementary;
  }

  /**
   * Get element affinity value
   */
  public getElementAffinity(element: Element): number {
    return this.gameState.player.elements[element] || 0;
  }

  /**
   * Get all element affinities
   */
  public getAllElementAffinities(): ElementAffinities {
    return { ...this.gameState.player.elements };
  }

  /**
   * Check if an element is fully cultivated (100% affinity)
   */
  public isElementFullyCultivated(element: Element): boolean {
    return this.getElementAffinity(element) >= CULTIVATION_RATES.MAX_ELEMENT_AFFINITY;
  }

  /**
   * Get the number of fully cultivated elements
   */
  public getFullyCultivatedElementCount(): number {
    return Object.values(this.gameState.player.elements).filter(
      affinity => affinity >= CULTIVATION_RATES.MAX_ELEMENT_AFFINITY
    ).length;
  }

  /**
   * Calculate elemental bonus for combat or other mechanics
   */
  public calculateElementalBonus(attackerElement: Element, defenderElement: Element): number {
    // Five Elements Cycle relationships
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

    if (generatingCycle[attackerElement] === defenderElement) {
      return 1.25; // Generating element: +25% damage
    }

    if (controllingCycle[attackerElement] === defenderElement) {
      return 0.75; // Controlling element: -25% damage
    }

    return 1.0; // Neutral: no modifier
  }

  /**
   * Get element cultivation progress as percentage
   */
  public getElementCultivationProgress(element: Element): number {
    return Math.min(100, this.getElementAffinity(element));
  }

  /**
   * Get elements that are unlocked for cultivation at current realm
   */
  public getUnlockedElements(): Element[] {
    const primaryElement = this.getPrimaryElement();
    if (!primaryElement) return [];

    const unlockedElements = [primaryElement];
    const complementaryElements = this.getComplementaryElements(primaryElement, this.gameState.player.realm);
    unlockedElements.push(...complementaryElements);

    return [...new Set(unlockedElements)]; // Remove duplicates
  }

  /**
   * Debug method - add element progress
   */
  public debugAddElementProgress(amount: number = 10): void {
    const player = this.gameState.player;
    const primaryElement = this.getPrimaryElement();
    let modifiedCount = 0;

    if (primaryElement) {
      const unlockedElements = this.getUnlockedElements();

      unlockedElements.forEach(element => {
        const currentAffinity = player.elements[element];
        if (currentAffinity < CULTIVATION_RATES.MAX_ELEMENT_AFFINITY) {
          player.elements[element] = Math.min(CULTIVATION_RATES.MAX_ELEMENT_AFFINITY, currentAffinity + amount);
          modifiedCount++;
        }
      });
    }

    console.log(`🐛 Debug: Added ${amount}% affinity to ${modifiedCount} unlocked elements`);
  }

  /**
   * Get element display information for UI
   */
  public getElementDisplayInfo(element: Element): {
    name: string;
    affinity: number;
    progress: number;
    isPrimary: boolean;
    isFullyCultivated: boolean;
  } {
    const primaryElement = this.getPrimaryElement();

    return {
      name: element,
      affinity: this.getElementAffinity(element),
      progress: this.getElementCultivationProgress(element),
      isPrimary: primaryElement === element,
      isFullyCultivated: this.isElementFullyCultivated(element)
    };
  }
}