/**
 * EventSystem - Handles random events, encounters, and life events
 *
 * Manages fortuitous encounters, tribulations, karmic rewards, and other
 * random events that affect the player's cultivation journey.
 */

import { GameState } from '../../types';
import { Random } from '../../utils/Random';
import { i18n } from '../../utils/i18n';

export class EventSystem {
  constructor(private gameState: GameState, private random: Random) {}

  /**
   * Process random life events
   */
  public processRandomEvent(): void {
    const events = [
      { name: i18n.t('events.fortuitousEncounter'), chance: 0.25, effect: () => this.fortuitousEncounter() },
      { name: i18n.t('events.tribulationChallenge'), chance: 0.25, effect: () => this.tribulationChallenge() },
      { name: i18n.t('events.karmicReward'), chance: 0.25, effect: () => this.karmicReward() },
      { name: i18n.t('events.enemyEncounter'), chance: 0.25, effect: () => this.enemyEncounter() }
    ];

    const event = this.random.weightedChoice(events, events.map(e => e.chance));
    console.log(i18n.t('messages.randomEvent', { event: event.name }));
    event.effect();
  }

  /**
   * Fortuitous encounter - increases talent
   */
  private fortuitousEncounter(): void {
    const talentGain = this.random.int(1, 5);
    this.gameState.player.talent = Math.min(100, this.gameState.player.talent + talentGain);
    console.log(i18n.t('messages.fortuitousEncounter', { talent: talentGain }));
  }

  /**
   * Tribulation challenge - potential reward or penalty
   */
  private tribulationChallenge(): void {
    if (this.random.chance(0.7)) {
      // Successful tribulation
      const qiReward = this.random.int(50, 200);
      this.gameState.player.qi = Math.min(this.gameState.player.qi + qiReward, this.gameState.player.maxQi);
      console.log(i18n.t('messages.tribulationSuccess', { qi: qiReward }));
    } else {
      // Failed tribulation
      const qiLoss = Math.floor(this.gameState.player.qi * 0.1);
      this.gameState.player.qi = Math.max(0, this.gameState.player.qi - qiLoss);
      console.log(i18n.t('messages.tribulationFailure', { qiLoss: qiLoss }));
    }
  }

  /**
   * Karmic reward - increases karmic balance
   */
  private karmicReward(): void {
    const karmaGain = this.random.int(1, 10);
    this.gameState.soul.karmicBalance += karmaGain;
    console.log(i18n.t('messages.karmicReward', { karma: karmaGain }));
  }

  /**
   * Enemy encounter - triggers combat system
   */
  private enemyEncounter(): void {
    // This would typically trigger the combat system
    // For now, just log that an enemy was encountered
    console.log(i18n.t('messages.enemyEncounterGeneric'));
  }

  /**
   * Process life milestone events
   */
  public processLifeMilestone(currentAge: number): void {
    // Age-based events
    if (currentAge === 50) {
      this.midLifeCrisis();
    } else if (currentAge === 100) {
      this.centuryMilestone();
    } else if (currentAge === 200) {
      this.longevityBreakthrough();
    }

    // Random life events (less frequent than daily events)
    if (this.random.chance(0.05)) { // 5% chance per day
      this.processRandomEvent();
    }
  }

  /**
   * Mid-life crisis event (age 50)
   */
  private midLifeCrisis(): void {
    console.log(i18n.t('events.midLifeCrisis'));

    if (this.random.chance(0.6)) {
      // Positive outcome
      const talentGain = this.random.int(2, 8);
      this.gameState.player.talent += talentGain;
      console.log(i18n.t('messages.midLifeCrisisPositive', { talent: talentGain }));
    } else {
      // Negative outcome
      const qiLoss = Math.floor(this.gameState.player.qi * 0.05);
      this.gameState.player.qi = Math.max(0, this.gameState.player.qi - qiLoss);
      console.log(i18n.t('messages.midLifeCrisisNegative', { qiLoss: qiLoss }));
    }
  }

  /**
   * Century milestone (age 100)
   */
  private centuryMilestone(): void {
    console.log(i18n.t('events.centuryMilestone'));

    // Guaranteed small talent boost
    const talentGain = this.random.int(1, 3);
    this.gameState.player.talent = Math.min(100, this.gameState.player.talent + talentGain);

    // Chance for karmic insight
    if (this.random.chance(0.3)) {
      const karmaGain = this.random.int(5, 15);
      this.gameState.soul.karmicBalance += karmaGain;
      console.log(i18n.t('messages.centuryMilestoneKarmic', { talent: talentGain, karma: karmaGain }));
    } else {
      console.log(i18n.t('messages.centuryMilestone', { talent: talentGain }));
    }
  }

  /**
   * Longevity breakthrough (age 200)
   */
  private longevityBreakthrough(): void {
    console.log(i18n.t('events.longevityBreakthrough'));

    // Significant cultivation boost
    const qiBoost = Math.floor(this.gameState.player.maxQi * 0.1);
    this.gameState.player.maxQi += qiBoost;
    this.gameState.player.qi = Math.min(this.gameState.player.qi + qiBoost, this.gameState.player.maxQi);

    const talentGain = this.random.int(3, 10);
    this.gameState.player.talent = Math.min(100, this.gameState.player.talent + talentGain);

    console.log(i18n.t('messages.longevityBreakthrough', {
      qi: qiBoost,
      talent: talentGain
    }));
  }

  /**
   * Process realm-specific events
   */
  public processRealmEvent(realm: import('../../types').CultivationRealm): void {
    switch (realm) {
      case 0: // Mortal
        this.processMortalRealmEvents();
        break;
      case 1: // Qi Condensation
        this.processQiCondensationEvents();
        break;
      case 2: // Foundation Establishment
        this.processFoundationEstablishmentEvents();
        break;
      // Add more realm-specific events as needed
    }
  }

  /**
   * Mortal realm specific events
   */
  private processMortalRealmEvents(): void {
    // Events focused on awakening spiritual awareness
    if (this.random.chance(0.1)) {
      console.log(i18n.t('events.spiritualAwakening'));
      const talentGain = this.random.int(1, 3);
      this.gameState.player.talent += talentGain;
      console.log(i18n.t('messages.spiritualAwakening', { talent: talentGain }));
    }
  }

  /**
   * Qi Condensation realm specific events
   */
  private processQiCondensationEvents(): void {
    // Events focused on meridian cultivation
    if (this.random.chance(0.08)) {
      console.log(i18n.t('events.meridianInsight'));
      // Boost random meridian purity
      const openMeridians = this.gameState.player.meridians.filter(m => m.isOpen);
      if (openMeridians.length > 0) {
        const randomMeridian = this.random.choice(openMeridians);
        const purityGain = this.random.int(5, 15);
        randomMeridian.purity = Math.min(100, randomMeridian.purity + purityGain);
        console.log(i18n.t('messages.meridianInsight', {
          meridian: randomMeridian.name,
          purity: purityGain
        }));
      }
    }
  }

  /**
   * Foundation Establishment realm specific events
   */
  private processFoundationEstablishmentEvents(): void {
    // Events focused on elemental harmony
    if (this.random.chance(0.06)) {
      console.log(i18n.t('events.elementalHarmony'));
      // Boost primary element affinity
      const primaryElement = this.getPrimaryElement();
      if (primaryElement) {
        const affinityGain = this.random.int(5, 10);
        this.gameState.player.elements[primaryElement] = Math.min(100, this.gameState.player.elements[primaryElement] + affinityGain);
        console.log(i18n.t('messages.elementalHarmony', {
          element: primaryElement,
          affinity: affinityGain
        }));
      }
    }
  }

  /**
   * Get the player's primary element
   */
  private getPrimaryElement(): import('../../types').Element | null {
    const elements = this.gameState.player.elements;
    let maxAffinity = 0;
    let primaryElement: import('../../types').Element | null = null;

    Object.entries(elements).forEach(([element, affinity]) => {
      if (typeof affinity === 'number' && affinity > maxAffinity) {
        maxAffinity = affinity;
        primaryElement = element as import('../../types').Element;
      }
    });

    return primaryElement;
  }

  /**
   * Process death and reincarnation events
   */
  public processDeath(): void {
    console.log(i18n.t('events.deathEvent'));

    // Calculate what carries over to next life
    const soul = this.gameState.soul;

    // Soul insights carry over
    // (Already handled in soul state)

    // Chance for special reincarnation benefits
    if (this.random.chance(0.2)) {
      this.specialReincarnation();
    }

    // Reset player for new life
    this.resetPlayerForNewLife();

    console.log(i18n.t('messages.reincarnationComplete', { lifetime: soul.lifetimeCount + 1 }));
  }

  /**
   * Special reincarnation event
   */
  private specialReincarnation(): void {
    console.log(i18n.t('events.specialReincarnation'));

    const benefits = [
      () => {
        const talentBoost = this.random.int(5, 15);
        this.gameState.player.talent += talentBoost;
        console.log(i18n.t('messages.specialReincarnationTalent', { talent: talentBoost }));
      },
      () => {
        const karmaBoost = this.random.int(10, 30);
        this.gameState.soul.karmicBalance += karmaBoost;
        console.log(i18n.t('messages.specialReincarnationKarma', { karma: karmaBoost }));
      },
      () => {
        // Boost elemental understanding
        const elements = Object.keys(this.gameState.player.elements) as import('../../types').Element[];
        const randomElement = this.random.choice(elements);
        const affinityBoost = this.random.int(10, 25);
        this.gameState.player.elements[randomElement] += affinityBoost;
        console.log(i18n.t('messages.specialReincarnationElement', {
          element: randomElement,
          affinity: affinityBoost
        }));
      }
    ];

    const benefit = this.random.choice(benefits);
    benefit();
  }

  /**
   * Reset player for new life
   */
  private resetPlayerForNewLife(): void {
    const player = this.gameState.player;
    const soul = this.gameState.soul;

    // Increment lifetime count
    soul.lifetimeCount++;
    soul.totalLifetime += player.lifetime;

    // Reset player stats but keep some benefits
    player.realm = 0; // Back to Mortal
    player.qi = 0;
    player.maxQi = 100; // Reset to base
    player.lifetime = 0;

    // Keep meridians but reset purity (with some carryover)
    player.meridians.forEach(meridian => {
      if (meridian.isOpen) {
        meridian.purity = Math.max(10, meridian.purity * 0.1); // Keep 10% of purity, minimum 10
      }
    });

    // Keep elements but reduce affinities (with some carryover)
    Object.keys(player.elements).forEach(element => {
      const elem = element as import('../../types').Element;
      player.elements[elem] = Math.max(0, player.elements[elem] * 0.2); // Keep 20% of affinity
    });

    // Keep artifacts
    // Keep talent (reduced)
    player.talent = Math.max(10, player.talent * 0.5); // Keep 50% of talent, minimum 10
  }
}