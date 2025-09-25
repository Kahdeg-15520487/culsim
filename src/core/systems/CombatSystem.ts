/**
 * CombatSystem - Handles enemy generation and combat resolution
 *
 * Manages random encounters, enemy creation, and combat mechanics
 * including elemental interactions and loot generation.
 */

import { GameState, Player, Enemy, CombatType, Element, ItemCategory, Item, LootItem, DamageType } from '../../types';
import { Random } from '../../utils/Random';
import { i18n } from '../../utils/i18n';
import { CultivationRealm } from '../../types';
import { ItemEffectProcessor } from '../../utils/ItemEffectProcessor';
import { ItemSystem } from '../../utils/ItemSystem';
import { InventorySystem } from '../../utils/InventorySystem';
import { HealthSystem } from './HealthSystem';

export class CombatSystem {
  private itemEffectProcessor: ItemEffectProcessor;
  private inventorySystem: InventorySystem;
  private healthSystem: HealthSystem;

  constructor(private gameState: GameState, private random: Random, inventorySystem: InventorySystem) {
    this.itemEffectProcessor = new ItemEffectProcessor(gameState);
    this.inventorySystem = inventorySystem;
    this.healthSystem = new HealthSystem(gameState);
    
    if (!this.inventorySystem) {
      console.error('WARNING: CombatSystem created with undefined inventorySystem!');
    }
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
      i18n.t('enemies.wildBeast'),
      i18n.t('enemies.bandit'),
      i18n.t('enemies.spiritBeast'),
      i18n.t('enemies.demonCultivator'),
      i18n.t('enemies.heavenlyTribulationRemnant'),
      i18n.t('enemies.ancientGuardian'),
      i18n.t('enemies.chaosSpirit')
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
    this.healthSystem.initializeEnemyHealth(enemy);
    return enemy;
  }

  /**
   * Generate loot table based on enemy realm
   */
  private generateLootTable(realm: CultivationRealm): LootItem[] {
    const lootTable: LootItem[] = [];

    // Higher realm enemies have better loot
    const qualityMultiplier = realm + 1;

    // Chance for spirit stones
    if (this.random.chance(0.6)) {
      const quality = ItemSystem.determineItemQuality(realm, {
        chance: (percent: number) => this.random.chance(percent / 100)
      });
      const spiritStone = ItemSystem.createItem(
        ItemCategory.SpiritStone,
        quality,
        realm
      );
      lootTable.push({
        item: spiritStone,
        dropRate: 1.0, // Always drops if chance passes
        quantity: 1
      });
    }

    // Chance for elemental crystals (herbs with elemental affinity)
    if (this.random.chance(0.3)) {
      const elements = [Element.Metal, Element.Wood, Element.Water, Element.Fire, Element.Earth];
      const element = this.random.choice(elements);
      const quality = ItemSystem.determineItemQuality(realm, {
        chance: (percent: number) => this.random.chance(percent / 100)
      });
      const elementalHerb = ItemSystem.createItem(
        ItemCategory.Herb,
        quality,
        realm,
        element
      );
      lootTable.push({
        item: elementalHerb,
        dropRate: 1.0,
        quantity: 1
      });
    }

    // Rare chance for cultivation pills
    if (this.random.chance(0.1)) {
      const quality = ItemSystem.determineItemQuality(realm, {
        chance: (percent: number) => this.random.chance(percent / 100)
      });
      const cultivationPill = ItemSystem.createItem(
        ItemCategory.Pill,
        quality,
        realm
      );
      lootTable.push({
        item: cultivationPill,
        dropRate: 1.0,
        quantity: 1
      });
    }

    return lootTable;
  }

  /**
   * Resolve combat between player and enemy
   */
  public resolveCombat(enemy: Enemy): { result: 'player_win' | 'enemy_win' | 'flee', droppedLoot: Item[] } {
    const player = this.gameState.player;

    console.log(i18n.t('messages.enemyEncounter', {
      enemy: enemy.name,
      realm: i18n.getRealmName(enemy.realm),
      qi: enemy.qi,
      maxQi: enemy.maxQi,
      health: enemy.health,
      maxHealth: enemy.maxHealth
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
      console.log(i18n.t('messages.criticalHit'));
      finalPlayerPower *= 2;
    }

    const playerWinChance = finalPlayerPower / (finalPlayerPower + finalEnemyPower);

    // Handle edge case where both powers are 0
    if (isNaN(playerWinChance)) {
      const droppedLoot = this.handlePlayerDefeat(enemy);
      return { result: 'enemy_win', droppedLoot };
    }

    if (this.random.chance(playerWinChance)) {
      const damageDealt = this.calculateDamage(player, enemy, finalPlayerPower, finalEnemyPower, isCritical);
      const actualDamage = this.healthSystem.applyDamage(enemy, damageDealt, DamageType.Physical);
      console.log(i18n.t('messages.playerAttack', { damage: actualDamage, enemy: enemy.name }));

      if (!this.healthSystem.isAlive(enemy)) {
        const droppedLoot = this.handlePlayerVictory(enemy);
        return { result: 'player_win', droppedLoot };
      } else {
        // Enemy survives and counterattacks
        const enemyDamage = this.calculateDamage(enemy, player, finalEnemyPower, finalPlayerPower, false);
        const actualEnemyDamage = this.healthSystem.applyDamage(player, enemyDamage, DamageType.Physical);
        console.log(i18n.t('messages.enemyAttack', { damage: actualEnemyDamage, enemy: enemy.name }));

        if (!this.healthSystem.isAlive(player)) {
          const droppedLoot = this.handlePlayerDefeat(enemy);
          return { result: 'enemy_win', droppedLoot };
        }
      }
    } else {
      // Player loses initial exchange
      const enemyDamage = this.calculateDamage(enemy, player, finalEnemyPower, finalPlayerPower, false);
      const actualEnemyDamage = this.healthSystem.applyDamage(player, enemyDamage, DamageType.Physical);
      console.log(i18n.t('messages.enemyAttack', { damage: actualEnemyDamage, enemy: enemy.name }));

      if (!this.healthSystem.isAlive(player)) {
        const droppedLoot = this.handlePlayerDefeat(enemy);
        return { result: 'enemy_win', droppedLoot };
      }
    }

    // Combat continues - for now, end in flee to avoid infinite loop
    console.log(i18n.t('messages.combatFlee'));
    return { result: 'flee', droppedLoot: [] };
  }

  /**
   * Player performs one attack in turn-based combat
   */
  public playerAttack(enemy: Enemy): { damage: number; enemyDefeated: boolean; enemyHealth: number; enemyMaxHealth: number } {
    const player = this.gameState.player;

    // Calculate combat power with item bonuses
    const playerCombatBonus = this.itemEffectProcessor.calculateCombatPowerBonus();
    const playerDefenseBonus = this.itemEffectProcessor.calculateDefenseBonus();
    const playerCritBonus = this.itemEffectProcessor.calculateCriticalChanceBonus();

    const playerPower = (player.qi + (player.talent * 2) + (player.realm * 100) + playerCombatBonus) * (1 + playerDefenseBonus / 100);
    const enemyPower = enemy.qi + (enemy.realm * 50);

    // Apply elemental bonuses
    const playerElementBonus = this.calculateElementalCombatBonus(player, enemy);
    const finalPlayerPower = playerPower * playerElementBonus;
    const finalEnemyPower = enemyPower;

    // Apply critical hit chance
    const critChance = Math.min(playerCritBonus / 100, 0.5);
    const isCritical = this.random.chance(critChance);

    if (isCritical) {
      console.log(i18n.t('messages.criticalHit'));
    }

    const damageDealt = this.calculateDamage(player, enemy, finalPlayerPower, finalEnemyPower, isCritical);
    const actualDamage = this.healthSystem.applyDamage(enemy, damageDealt, DamageType.Physical);
    console.log(i18n.t('messages.playerAttack', { damage: actualDamage, enemy: enemy.name }));

    const enemyDefeated = !this.healthSystem.isAlive(enemy);

    return {
      damage: actualDamage,
      enemyDefeated,
      enemyHealth: enemy.health!,
      enemyMaxHealth: enemy.maxHealth!
    };
  }

  /**
   * Enemy performs one attack in turn-based combat
   */
  public enemyAttack(player: Player, enemy: Enemy): { damage: number; playerDefeated: boolean; playerHealth: number; playerMaxHealth: number } {
    const enemyPower = enemy.qi + (enemy.realm * 50);
    const playerPower = (player.qi + (player.talent * 2) + (player.realm * 100)) * (1 + this.itemEffectProcessor.calculateDefenseBonus() / 100);

    // Apply elemental bonuses
    const enemyElementBonus = this.calculateElementalCombatBonus(enemy, player);
    const finalEnemyPower = enemyPower * enemyElementBonus;

    const damageDealt = this.calculateDamage(enemy, player, finalEnemyPower, playerPower, false);
    const actualDamage = this.healthSystem.applyDamage(player, damageDealt, DamageType.Physical);
    console.log(i18n.t('messages.enemyAttack', { damage: actualDamage, enemy: enemy.name }));

    const playerDefeated = !this.healthSystem.isAlive(player);

    return {
      damage: actualDamage,
      playerDefeated,
      playerHealth: player.health!,
      playerMaxHealth: player.maxHealth!
    };
  }

  /**
   * Attempt to flee from combat
   */
  public attemptFlee(): boolean {
    // 70% success rate for fleeing
    const fleeSuccess = this.random.chance(0.7);
    console.log(i18n.t('messages.combatFlee'));
    return fleeSuccess;
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
  public handlePlayerVictory(enemy: Enemy): Item[] {
    const player = this.gameState.player;

    // Calculate rewards
    const qiReward = Math.floor(enemy.maxQi * 0.1);
    const talentReward = this.random.int(1, 3);

    player.qi = Math.min(player.qi + qiReward, player.maxQi);
    player.talent = Math.min(100, player.talent + talentReward);

    // Process loot and get dropped items
    const droppedLoot = this.processLoot(enemy.lootTable);

    console.log(i18n.t('messages.combatVictory', {
      enemy: enemy.name,
      qi: qiReward,
      talent: talentReward
    }));
    
    return droppedLoot;
  }

  /**
   * Handle player defeat in combat
   */
  public handlePlayerDefeat(enemy: Enemy): Item[] {
    const player = this.gameState.player;

    // No longer reduce qi on defeat - health represents physical condition
    // Qi loss now only happens through specific mechanics (like failed breakthroughs)

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
      enemy: enemy.name
    }));
    
    return []; // No loot on defeat
  }

  /**
   * Process loot from defeated enemy
   */
  private processLoot(lootTable: LootItem[]): Item[] {
    const droppedItems: Item[] = [];
    
    lootTable.forEach((lootItem, index) => {
      // Check if item drops based on drop rate
      if (this.random.chance(lootItem.dropRate)) {
        // Create a copy of the item with the specified quantity
        const itemToAdd = {
          ...lootItem.item,
          quantity: lootItem.quantity
        };

        // Check if inventory system is available
        if (!this.inventorySystem) {
          console.error('ERROR: InventorySystem is undefined in CombatSystem!');
          return droppedItems;
        }
        // Add to inventory system
        this.inventorySystem.addItem(itemToAdd);
        
        // Add to dropped items list for UI
        droppedItems.push(itemToAdd);
      }
    });
    
    return droppedItems;
  }

  /**
   * Calculate damage dealt in combat
   */
  private calculateDamage(attacker: any, defender: any, attackerPower: number, defenderPower: number, isCritical: boolean): number {
    // Base damage calculation
    const powerRatio = attackerPower / (attackerPower + defenderPower);
    let baseDamage = Math.floor(powerRatio * 50) + 10; // 10-60 base damage

    // Critical hit bonus
    if (isCritical) {
      baseDamage *= 2;
    }

    // Realm difference modifier
    const realmDiff = attacker.realm - defender.realm;
    if (realmDiff > 0) {
      baseDamage *= (1 + realmDiff * 0.25); // Higher realm attackers do more damage
    } else if (realmDiff < 0) {
      baseDamage *= Math.max(0.25, 1 + realmDiff * 0.5); // Lower realm attackers do less damage
    }

    // Random variation (±20%)
    const variation = this.random.float(0.8, 1.2);
    baseDamage = Math.floor(baseDamage * variation);

    return Math.max(1, baseDamage); // Minimum 1 damage
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