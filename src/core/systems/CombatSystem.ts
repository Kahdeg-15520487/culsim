/**
 * CombatSystem - Handles enemy generation and combat resolution
 *
 * Manages random encounters, enemy creation, and combat mechanics
 * including elemental interactions and loot generation.
 */

import { GameState, Enemy, CombatType, Element, ItemCategory } from '../../types';
import { Random } from '../../utils/Random';
import { i18n } from '../../utils/i18n';
import { CultivationRealm } from '../../types';
import { ItemEffectProcessor } from '../../utils/ItemEffectProcessor';
import { ItemSystem } from '../../utils/ItemSystem';

export class CombatSystem {
  private itemEffectProcessor: ItemEffectProcessor;

  constructor(private gameState: GameState, private random: Random) {
    this.itemEffectProcessor = new ItemEffectProcessor(gameState);
  }

  /**
   * Generate a random enemy for combat encounters
   */
  public generateRandomEnemy(): Enemy {
    const realm = this.random.weightedChoice(
      [CultivationRealm.Mortal, CultivationRealm.QiCondensation, CultivationRealm.FoundationEstablishment],
      [0.5, 0.3, 0.2]
    );

    const enemyNames = [
      'Wild Beast', 'Bandit', 'Spirit Beast', 'Demon Cultivator',
      'Heavenly Tribulation Remnant', 'Ancient Guardian', 'Chaos Spirit'
    ];

    let qiMin = 20, qiMax = 80;
    let maxQiMin = 50, maxQiMax = 150;

    if (realm >= CultivationRealm.QiCondensation) {
      qiMin = 200; qiMax = 800;
      maxQiMin = 300; maxQiMax = 1000;
    }
    if (realm >= CultivationRealm.FoundationEstablishment) {
      qiMin = 2000; qiMax = 8000;
      maxQiMin = 3000; maxQiMax = 10000;
    }

    const enemy: Enemy = {
      id: `enemy-${Date.now()}-${this.random.int(1000, 9999)}`,
      name: this.random.choice(enemyNames),
      realm,
      qi: this.random.int(qiMin, qiMax),
      maxQi: this.random.int(maxQiMin, maxQiMax),
      elements: {
        [Element.Metal]: this.random.int(0, 50),
        [Element.Wood]: this.random.int(0, 50),
        [Element.Water]: this.random.int(0, 50),
        [Element.Fire]: this.random.int(0, 50),
        [Element.Earth]: this.random.int(0, 50)
      },
      combatType: this.random.choice([CombatType.Melee, CombatType.Ranged]),
      aggression: this.random.int(30, 90),
      lootTable: this.generateLootTable(realm)
    };

    enemy.qi = Math.min(enemy.qi, enemy.maxQi);
    return enemy;
  }

  /**
   * Generate loot table based on enemy realm
   */
  private generateLootTable(realm: CultivationRealm): any[] {
    const lootTable = [];

    // Higher realm enemies have better loot
    const qualityMultiplier = realm + 1;

    // Chance for spirit stones
    if (this.random.chance(0.6)) {
      lootTable.push({
        type: 'artifact',
        name: 'Spirit Stone',
        description: 'A stone containing spiritual energy',
        value: this.random.int(10, 50) * qualityMultiplier
      });
    }

    // Chance for elemental crystals
    if (this.random.chance(0.3)) {
      const elements = [Element.Metal, Element.Wood, Element.Water, Element.Fire, Element.Earth];
      const element = this.random.choice(elements);
      lootTable.push({
        type: 'elemental_crystal',
        element,
        name: `${element} Crystal`,
        description: `A crystal infused with ${element} energy`,
        value: this.random.int(25, 100) * qualityMultiplier
      });
    }

    // Rare chance for cultivation insight
    if (this.random.chance(0.1)) {
      lootTable.push({
        type: 'cultivation_insight',
        name: 'Ancient Scroll',
        description: 'Contains insights into cultivation techniques',
        value: this.random.int(50, 200) * qualityMultiplier
      });
    }

    return lootTable;
  }

  /**
   * Resolve combat between player and enemy
   */
  public resolveCombat(enemy: Enemy): 'player_win' | 'enemy_win' | 'flee' {
    const player = this.gameState.player;

    console.log(i18n.t('messages.enemyEncounter', {
      enemy: enemy.name,
      realm: enemy.realm,
      qi: enemy.qi,
      maxQi: enemy.maxQi
    }));

    // Calculate combat power with item bonuses
    const playerCombatBonus = this.itemEffectProcessor.calculateCombatPowerBonus();
    const playerDefenseBonus = this.itemEffectProcessor.calculateDefenseBonus();
    const playerCritBonus = this.itemEffectProcessor.calculateCriticalChanceBonus();

    const playerPower = (player.qi + (player.talent * 2) + (player.realm * 100) + playerCombatBonus) * (1 + playerDefenseBonus / 100);
    const enemyPower = enemy.qi + (enemy.realm * 50);

    // Apply elemental bonuses
    const playerElementBonus = this.calculateElementalCombatBonus(player, enemy);
    const enemyElementBonus = this.calculateElementalCombatBonus(enemy, player);

    let finalPlayerPower = playerPower * playerElementBonus;
    const finalEnemyPower = enemyPower * enemyElementBonus;

    // Apply critical hit chance
    const critChance = Math.min(playerCritBonus / 100, 0.5); // Max 50% crit chance
    const isCritical = this.random.chance(critChance);

    if (isCritical) {
      console.log('💥 Critical hit! Damage doubled!');
      finalPlayerPower *= 2;
    }

    const playerWinChance = finalPlayerPower / (finalPlayerPower + finalEnemyPower);

    if (this.random.chance(playerWinChance)) {
      this.handlePlayerVictory(enemy);
      return 'player_win';
    } else {
      this.handlePlayerDefeat(enemy);
      return 'enemy_win';
    }
  }

  /**
   * Calculate elemental bonus in combat
   */
  private calculateElementalCombatBonus(attacker: any, defender: any): number {
    // Find attacker's strongest element
    let attackerElement: Element | null = null;
    let maxAffinity = 0;

    Object.entries(attacker.elements || {}).forEach(([element, affinity]) => {
      if (typeof affinity === 'number' && affinity > maxAffinity) {
        maxAffinity = affinity;
        attackerElement = element as Element;
      }
    });

    if (!attackerElement) return 1.0;

    // Find defender's strongest element
    let defenderElement: Element | null = null;
    maxAffinity = 0;

    Object.entries(defender.elements || {}).forEach(([element, affinity]) => {
      if (typeof affinity === 'number' && affinity > maxAffinity) {
        maxAffinity = affinity;
        defenderElement = element as Element;
      }
    });

    if (!defenderElement) return 1.0;

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
   * Handle player victory in combat
   */
  private handlePlayerVictory(enemy: Enemy): void {
    const player = this.gameState.player;

    // Calculate rewards
    const qiReward = Math.floor(enemy.maxQi * 0.1);
    const talentReward = this.random.int(1, 3);

    player.qi = Math.min(player.qi + qiReward, player.maxQi);
    player.talent = Math.min(100, player.talent + talentReward);

    // Process loot
    this.processLoot(enemy.lootTable);

    console.log(i18n.t('messages.combatVictory', {
      enemy: enemy.name,
      qi: qiReward,
      talent: talentReward
    }));
  }

  /**
   * Handle player defeat in combat
   */
  private handlePlayerDefeat(enemy: Enemy): void {
    const player = this.gameState.player;

    // Calculate penalties
    const qiLoss = Math.floor(player.qi * 0.2);
    player.qi = Math.max(0, player.qi - qiLoss);

    // Chance of injury affecting cultivation
    if (this.random.chance(0.3)) {
      const meridianDamage = this.random.int(1, 5);
      const randomMeridian = this.random.choice(player.meridians.filter(m => m.isOpen));
      if (randomMeridian) {
        randomMeridian.purity = Math.max(0, randomMeridian.purity - meridianDamage);
        console.log(i18n.t('messages.meridianDamage', {
          meridian: randomMeridian.name,
          damage: meridianDamage
        }));
      }
    }

    console.log(i18n.t('messages.combatDefeat', {
      enemy: enemy.name,
      qiLoss: qiLoss
    }));
  }

  /**
   * Process loot from defeated enemy
   */
  private processLoot(lootTable: any[]): void {
    lootTable.forEach(item => {
      switch (item.type) {
        case 'artifact':
          // Create proper Item object for spirit stones
          if (item.name === 'Spirit Stone') {
            const quality = ItemSystem.determineItemQuality(this.gameState.player.realm, {
              chance: (percent: number) => this.random.chance(percent / 100)
            });
            const spiritStone = ItemSystem.createItem(
              ItemCategory.SpiritStone,
              quality,
              this.gameState.player.realm
            );
            this.gameState.player.items.push(spiritStone);
            console.log(i18n.t('messages.lootArtifact', {
              name: spiritStone.name,
              value: spiritStone.value
            }));
          } else {
            // For other artifacts, still use legacy system for now
            const artifact = {
              id: `artifact-${Date.now()}-${this.random.int(1000, 9999)}`,
              name: item.name,
              type: 'spirit_stone',
              effects: [{
                type: 'qi_absorption' as const,
                value: item.value
              }]
            };
            this.gameState.player.artifacts.push(artifact);
            console.log(i18n.t('messages.lootArtifact', {
              name: item.name,
              value: item.value
            }));
          }
          break;

        case 'elemental_crystal':
          // Boost elemental affinity
          const element = item.element as Element;
          const currentAffinity = this.gameState.player.elements[element] || 0;
          this.gameState.player.elements[element] = Math.min(100, currentAffinity + item.value / 10);
          console.log(i18n.t('messages.lootElementalCrystal', {
            element: element,
            affinity: (item.value / 10).toFixed(1)
          }));
          break;

        case 'cultivation_insight':
          // Boost talent
          const talentBoost = Math.floor(item.value / 10);
          this.gameState.player.talent = Math.min(100, this.gameState.player.talent + talentBoost);
          console.log(i18n.t('messages.lootCultivationInsight', {
            talent: talentBoost
          }));
          break;
      }
    });
  }

  /**
   * Check if player should flee from combat
   */
  public shouldFlee(enemy: Enemy): boolean {
    const player = this.gameState.player;

    // Flee if enemy is significantly stronger
    const playerPower = player.qi + (player.talent * 2) + (player.realm * 100);
    const enemyPower = enemy.qi + (enemy.realm * 50);

    return enemyPower > playerPower * 1.5;
  }

  /**
   * Get combat difficulty rating
   */
  public getCombatDifficulty(enemy: Enemy): 'easy' | 'medium' | 'hard' | 'deadly' {
    const player = this.gameState.player;

    const playerPower = player.qi + (player.talent * 2) + (player.realm * 100);
    const enemyPower = enemy.qi + (enemy.realm * 50);

    const ratio = enemyPower / playerPower;

    if (ratio < 0.5) return 'easy';
    if (ratio < 1.0) return 'medium';
    if (ratio < 1.5) return 'hard';
    return 'deadly';
  }
}