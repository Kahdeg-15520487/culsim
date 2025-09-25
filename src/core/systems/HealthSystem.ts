/**
 * HealthSystem - Manages health mechanics for players and enemies
 *
 * Handles health regeneration, damage application, recovery mechanics,
 * and health-based status effects in the cultivation game.
 */

import { GameState, Player, Enemy, CultivationRealm, DamageType } from '../../types';
import { ItemEffectProcessor } from '../../utils/ItemEffectProcessor';

export class HealthSystem {
  private itemEffectProcessor: ItemEffectProcessor;

  constructor(private gameState: GameState) {
    this.itemEffectProcessor = new ItemEffectProcessor(gameState);
  }

  /**
   * Calculate base max health for a player based on realm and cultivation
   */
  public calculateMaxHealth(player: Player): number {
    const baseHealth = 100; // Mortal realm base
    const realmMultiplier = this.getRealmHealthMultiplier(player.realm);
    const qiBonus = Math.floor(player.maxQi / 10); // 1 health per 10 max qi
    const talentBonus = Math.floor(player.talent / 2); // 0.5 health per talent point

    return Math.floor(baseHealth * realmMultiplier + qiBonus + talentBonus);
  }

  /**
   * Calculate base max health for an enemy based on realm
   */
  public calculateMaxHealthForEnemy(enemy: Enemy): number {
    const baseHealth = 80; // Enemy base (slightly lower than player)
    const realmMultiplier = this.getRealmHealthMultiplier(enemy.realm);
    const qiBonus = Math.floor(enemy.maxQi / 8); // 1 health per 8 max qi for enemies

    return Math.floor(baseHealth * realmMultiplier + qiBonus);
  }

  /**
   * Get health multiplier based on cultivation realm
   */
  private getRealmHealthMultiplier(realm: CultivationRealm): number {
    switch (realm) {
      case CultivationRealm.Mortal: return 1.0;
      case CultivationRealm.QiCondensation: return 1.5;
      case CultivationRealm.FoundationEstablishment: return 2.5;
      case CultivationRealm.CoreFormation: return 4.0;
      case CultivationRealm.NascentSoul: return 7.0;
      case CultivationRealm.DivineTransformation: return 12.0;
      case CultivationRealm.VoidRefinement: return 20.0;
      case CultivationRealm.ImmortalAscension: return 35.0;
      default: return 1.0;
    }
  }

  /**
   * Apply damage to an entity
   */
  public applyDamage(entity: Player | Enemy, damage: number, damageType: DamageType): number {
    if (entity.health === undefined || entity.maxHealth === undefined) {
      throw new Error('Entity health not initialized');
    }

    let actualDamage = damage;

    // Apply damage type modifiers
    switch (damageType) {
      case DamageType.Physical:
        actualDamage = this.applyPhysicalDamage(entity, damage);
        break;
      case DamageType.Spiritual:
        actualDamage = this.applySpiritualDamage(entity, damage);
        break;
      case DamageType.Elemental:
        actualDamage = this.applyElementalDamage(entity, damage);
        break;
    }

    // Ensure damage doesn't go below 0
    actualDamage = Math.max(0, actualDamage);

    // Apply damage to health
    entity.health = Math.max(0, entity.health - actualDamage);

    return actualDamage;
  }

  /**
   * Apply physical damage (reduced by physical defense)
   */
  private applyPhysicalDamage(entity: Player | Enemy, damage: number): number {
    // For now, no physical defense system - just return full damage
    // This can be expanded later with armor/defense stats
    return damage;
  }

  /**
   * Apply spiritual damage (reduced by cultivation realm and qi)
   */
  private applySpiritualDamage(entity: Player | Enemy, damage: number): number {
    // Spiritual damage is reduced by cultivation realm
    const realmReduction = this.getRealmHealthMultiplier(entity.realm) * 0.1; // 10% per realm level
    const qiReduction = Math.min(entity.qi / entity.maxQi * 0.2, 0.2); // Up to 20% reduction based on qi percentage

    const totalReduction = Math.min(realmReduction + qiReduction, 0.5); // Max 50% reduction
    return damage * (1 - totalReduction);
  }

  /**
   * Apply elemental damage (can be amplified or reduced by elemental affinities)
   */
  private applyElementalDamage(entity: Player | Enemy, damage: number): number {
    // For now, elemental damage is standard - can be expanded with elemental resistances
    return damage;
  }

  /**
   * Heal an entity
   */
  public heal(entity: Player | Enemy, amount: number): number {
    if (entity.health === undefined || entity.maxHealth === undefined) {
      throw new Error('Entity health not initialized');
    }

    const oldHealth = entity.health;
    entity.health = Math.min(entity.maxHealth, entity.health + amount);
    return entity.health - oldHealth; // Return actual healing done
  }

  /**
   * Regenerate health over time (called each game tick)
   */
  public regenerateHealth(entity: Player | Enemy): number {
    if (entity.health === undefined || entity.maxHealth === undefined) {
      return 0; // Cannot regenerate if health not initialized
    }

    if (entity.health >= entity.maxHealth) {
      return 0; // Already at full health
    }

    // Base regeneration rate: 1 health per day for mortals
    let regenRate = 1.0;

    // Higher realms regenerate faster
    regenRate *= Math.sqrt(this.getRealmHealthMultiplier(entity.realm));

    // Health regeneration is slower when injured
    const healthPercentage = entity.health / entity.maxHealth;
    if (healthPercentage < 0.5) {
      regenRate *= 0.5; // 50% slower when below 50% health
    }

    // Talent affects regeneration (only for players)
    if ('talent' in entity) {
      regenRate *= (1 + entity.talent / 200); // Up to 50% bonus at max talent
    }

    // Add item bonuses (only for players)
    if ('talent' in entity) {
      const itemBonus = this.itemEffectProcessor.calculateHealthRegenerationBonus();
      regenRate += itemBonus;
    }

    const regenAmount = Math.max(1, Math.floor(regenRate));
    return this.heal(entity, regenAmount);
  }

  /**
   * Check if entity is alive
   */
  public isAlive(entity: Player | Enemy): boolean {
    return entity.health !== undefined && entity.health > 0;
  }

  /**
   * Get health percentage (0-100)
   */
  public getHealthPercentage(entity: Player | Enemy): number {
    if (entity.health === undefined || entity.maxHealth === undefined) {
      return 0;
    }
    return Math.round((entity.health / entity.maxHealth) * 100);
  }

  /**
   * Initialize health for a new player
   */
  public initializePlayerHealth(player: Player): void {
    player.maxHealth = this.calculateMaxHealth(player);
    player.health = player.maxHealth; // Start at full health
  }

  /**
   * Initialize health for a new enemy
   */
  public initializeEnemyHealth(enemy: Enemy): void {
    enemy.maxHealth = this.calculateMaxHealthForEnemy(enemy);
    enemy.health = enemy.maxHealth; // Start at full health
  }

  /**
   * Update max health when player stats change (realm breakthrough, etc.)
   */
  public updateMaxHealth(player: Player): void {
    if (player.health === undefined || player.maxHealth === undefined) {
      // Initialize health if not set
      this.initializePlayerHealth(player);
      return;
    }

    const newMaxHealth = this.calculateMaxHealth(player);
    const healthPercentage = player.health / player.maxHealth;
    player.maxHealth = newMaxHealth;
    player.health = Math.min(player.health, Math.floor(newMaxHealth * healthPercentage));
  }
}