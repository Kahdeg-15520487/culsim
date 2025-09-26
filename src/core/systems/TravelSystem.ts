/**
 * TravelSystem - Manages world map navigation and location-based events
 *
 * Handles player movement between locations, location properties,
 * and location-specific events and encounters.
 */

import { GameState, Player, Location, LocationType, TravelPath, LocationEvent } from '../../types';
import { Random } from '../../utils/Random';
import { i18n } from '../../utils/i18n';
import { EventSystem } from './EventSystem';
import { CombatSystem } from './CombatSystem';
import locationData from '../../data/locations.json';

export class TravelSystem {
  private eventSystem: EventSystem;
  private combatSystem: CombatSystem;

  constructor(
    private gameState: GameState,
    private random: Random,
    eventSystem: EventSystem,
    combatSystem: CombatSystem
  ) {
    this.eventSystem = eventSystem;
    this.combatSystem = combatSystem;
  }

  /**
   * Generate the world map by loading locations from JSON data
   */
  public generateWorldMap(): Location[] {
    const locations: Location[] = [];

    // Load locations from JSON data
    locationData.locations.forEach(locationJson => {
      const location = this.createLocationFromData(locationJson);
      locations.push(location);
    });

    // Set starting location
    this.gameState.player.currentLocationId = locationData.startingLocationId;

    return locations;
  }

  /**
   * Create a location from JSON data
   */
  private createLocationFromData(locationData: any): Location {
    // Map string type to enum
    const typeMap: { [key: string]: LocationType } = {
      'village': LocationType.Village,
      'cultivation_site': LocationType.CultivationSite,
      'dangerous_area': LocationType.DangerousArea,
      'secret_realm': LocationType.SecretRealm,
      'ancient_ruin': LocationType.AncientRuin
    };

    const location: Location = {
      id: locationData.id,
      type: typeMap[locationData.type] || LocationType.Village,
      name: i18n.t(locationData.nameKey),
      description: i18n.t(locationData.descriptionKey),
      nameKey: locationData.nameKey,
      descriptionKey: locationData.descriptionKey,
      position: locationData.position,
      properties: locationData.properties,
      connectedLocations: locationData.connectedLocations || [],
      discovered: locationData.discovered || false,
      lastVisited: locationData.discovered ? Date.now() : undefined
    };

    return location;
  }

  /**
   * Get the world map locations with current state
   */
  public getWorldMap(): Location[] {
    return this.gameState.worldMap;
  }

  /**
   * Get the current location ID from the state
   */
  public getCurrentLocationId(): string {
    return this.gameState.player.currentLocationId;
  }

  /**
   * Travel to a connected location
   */
  public travelToLocation(targetLocationId: string): { success: boolean; events?: LocationEvent[] } {
    console.log('TravelSystem: Starting travel to', targetLocationId);
    console.log('TravelSystem: Current player location ID:', this.gameState.player.currentLocationId);
    
    const currentLocation = this.gameState.worldMap.find(loc => loc.id === this.gameState.player.currentLocationId);
    const targetLocation = this.gameState.worldMap.find(loc => loc.id === targetLocationId);

    console.log('TravelSystem: Found current location:', currentLocation?.id);
    console.log('TravelSystem: Found target location:', targetLocation?.id);

    if (!currentLocation || !targetLocation) {
      console.log(i18n.t('messages.locationNotFound'));
      return { success: false };
    }

    const path = currentLocation.connectedLocations.find(p => p.targetLocationId === targetLocationId);
    if (!path) {
      console.log(i18n.t('messages.noPathAvailable'));
      return { success: false };
    }

    // Check if player has enough time/energy for travel
    const travelCost = Math.ceil(path.travelTime / 2); // Energy cost is half travel time
    if (this.gameState.player.energy < travelCost) {
      console.log(i18n.t('messages.notEnoughEnergy'));
      return { success: false };
    }

    // Deduct travel cost
    this.gameState.player.energy -= travelCost;

    // Advance time
    this.gameState.time += path.travelTime * 60 * 60 * 1000; // Convert hours to milliseconds

    // Mark target location as discovered
    console.log('TravelSystem: Before marking discovered - target location discovered:', targetLocation.discovered);
    targetLocation.discovered = true;
    targetLocation.lastVisited = Date.now();
    console.log('TravelSystem: After marking discovered - target location discovered:', targetLocation.discovered);

    // Update player location
    console.log('TravelSystem: Before location update - player currentLocationId:', this.gameState.player.currentLocationId);
    this.gameState.player.currentLocationId = targetLocationId;
    console.log('TravelSystem: After location update - player currentLocationId:', this.gameState.player.currentLocationId);

    console.log(i18n.t('messages.arrivedAtLocation', {
      location: targetLocation.name,
      travelTime: path.travelTime
    }));

    // Generate location events
    const events = this.generateLocationEvents(targetLocation);

    return { success: true, events };
  }

  /**
   * Generate events that occur when arriving at a location
   */
  private generateLocationEvents(location: Location): LocationEvent[] {
    const events: LocationEvent[] = [];

    // Random encounter chance based on location properties
    if (this.random.chance(location.properties.eventFrequency)) {
      switch (location.type) {
        case LocationType.CultivationSite:
          events.push(this.generateCultivationEvent(location));
          break;
        case LocationType.Village:
          events.push(this.generateVillageEvent(location));
          break;
        case LocationType.DangerousArea:
          events.push(this.generateDangerEvent(location));
          break;
        case LocationType.SecretRealm:
          events.push(this.generateSecretRealmEvent(location));
          break;
        case LocationType.AncientRuin:
          events.push(this.generateAncientRuinEvent(location));
          break;
      }
    }

    // Qi absorption opportunity
    if (this.random.chance(location.properties.qiDensity * 0.3)) {
      events.push(this.generateQiAbsorptionEvent(location));
    }

    return events;
  }

  /**
   * Generate cultivation-specific events
   */
  private generateCultivationEvent(location: Location): LocationEvent {
    const eventTypes = ['meditation', 'breakthrough', 'enlightenment', 'disturbance'];
    const eventType = this.random.choice(eventTypes);

    switch (eventType) {
      case 'meditation':
        return {
          id: `cultivation-${Date.now()}`,
          type: 'cultivation',
          title: i18n.t('events.cultivationMeditation'),
          description: i18n.t('events.cultivationMeditationDesc', { location: location.name }),
          choices: [
            {
              text: i18n.t('events.meditate'),
              effect: () => {
                const qiGain = Math.floor(this.gameState.player.maxQi * location.properties.cultivationBonus);
                this.gameState.player.qi = Math.min(this.gameState.player.qi + qiGain, this.gameState.player.maxQi);
                console.log(i18n.t('messages.qiAbsorbed', { qi: qiGain }));
              }
            },
            {
              text: i18n.t('events.continueJourney'),
              effect: () => {} // No effect
            }
          ]
        };

      case 'breakthrough':
        return {
          id: `breakthrough-${Date.now()}`,
          type: 'cultivation',
          title: i18n.t('events.cultivationBreakthrough'),
          description: i18n.t('events.cultivationBreakthroughDesc', { location: location.name }),
          choices: [
            {
              text: i18n.t('events.attemptBreakthrough'),
              effect: () => {
                // Attempt breakthrough with success chance based on cultivation
                const successChance = Math.min(0.8, this.gameState.player.talent / 100);
                if (this.random.chance(successChance)) {
                  // Successful breakthrough logic would go here
                  console.log(i18n.t('messages.breakthroughSuccess'));
                } else {
                  console.log(i18n.t('messages.breakthroughFailed'));
                }
              }
            }
          ]
        };

      default:
        return {
          id: `disturbance-${Date.now()}`,
          type: 'encounter',
          title: i18n.t('events.cultivationDisturbance'),
          description: i18n.t('events.cultivationDisturbanceDesc'),
          choices: [
            {
              text: i18n.t('events.investigate'),
              effect: () => {
                // Generate random encounter
                const enemy = this.combatSystem.generateRandomEnemy();
                console.log(i18n.t('messages.encounter', { enemy: enemy.name }));
              }
            }
          ]
        };
    }
  }

  /**
   * Generate village-specific events
   */
  private generateVillageEvent(location: Location): LocationEvent {
    const eventTypes = ['quest', 'merchant', 'rumor', 'trouble'];
    const eventType = this.random.choice(eventTypes);

    switch (eventType) {
      case 'quest':
        return {
          id: `quest-${Date.now()}`,
          type: 'quest',
          title: i18n.t('events.villageQuest'),
          description: i18n.t('events.villageQuestDesc'),
          choices: [
            {
              text: i18n.t('events.acceptQuest'),
              effect: () => {
                // Add quest to player's active quests
                console.log(i18n.t('messages.questAccepted'));
              }
            },
            {
              text: i18n.t('events.declineQuest'),
              effect: () => {}
            }
          ]
        };

      case 'merchant':
        if (this.random.chance(location.properties.merchantPresence)) {
          return {
            id: `merchant-${Date.now()}`,
            type: 'merchant',
            title: i18n.t('events.merchantEncounter'),
            description: i18n.t('events.merchantEncounterDesc'),
            choices: [
              {
                text: i18n.t('events.trade'),
                effect: () => {
                  // Open merchant interface
                  console.log(i18n.t('messages.merchantGreeting'));
                }
              }
            ]
          };
        }
        break;

      case 'trouble':
        return {
          id: `trouble-${Date.now()}`,
          type: 'combat',
          title: i18n.t('events.villageTrouble'),
          description: i18n.t('events.villageTroubleDesc'),
          choices: [
            {
              text: i18n.t('events.helpVillagers'),
              effect: () => {
                const enemy = this.combatSystem.generateRandomEnemy();
                console.log(i18n.t('messages.villainEncounter', { enemy: enemy.name }));
              }
            },
            {
              text: i18n.t('events.ignore'),
              effect: () => {
                // Possible karma loss
                this.gameState.player.karma = Math.max(0, this.gameState.player.karma - 5);
              }
            }
          ]
        };
    }

    // Default event
    return {
      id: `village-${Date.now()}`,
      type: 'social',
      title: i18n.t('events.villageLife'),
      description: i18n.t('events.villageLifeDesc'),
      choices: [
        {
          text: i18n.t('events.rest'),
          effect: () => {
            // Restore some energy
            this.gameState.player.energy = Math.min(100, this.gameState.player.energy + 20);
          }
        }
      ]
    };
  }

  /**
   * Generate dangerous area events
   */
  private generateDangerEvent(location: Location): LocationEvent {
    return {
      id: `danger-${Date.now()}`,
      type: 'combat',
      title: i18n.t('events.dangerEncounter'),
      description: i18n.t('events.dangerEncounterDesc', { location: location.name }),
      choices: [
        {
          text: i18n.t('events.fight'),
          effect: () => {
            const enemy = this.combatSystem.generateRandomEnemy();
            console.log(i18n.t('messages.ambush', { enemy: enemy.name }));
          }
        },
        {
          text: i18n.t('events.flee'),
          effect: () => {
            if (this.combatSystem.attemptFlee()) {
              console.log(i18n.t('messages.fledSuccessfully'));
            } else {
              console.log(i18n.t('messages.fleeFailed'));
            }
          }
        }
      ]
    };
  }

  /**
   * Generate secret realm events
   */
  private generateSecretRealmEvent(location: Location): LocationEvent {
    const eventTypes = ['realm_insight', 'realm_trial', 'realm_opportunity'];
    const eventType = this.random.choice(eventTypes);

    switch (eventType) {
      case 'realm_insight':
        return {
          id: `realm-insight-${Date.now()}`,
          type: 'cultivation',
          title: i18n.t('events.realmInsight'),
          description: i18n.t('events.realmInsightDesc', { location: location.name }),
          choices: [
            {
              text: i18n.t('events.studyFormation'),
              effect: () => {
                // Grant cultivation insight
                this.gameState.player.talent = Math.min(100, this.gameState.player.talent + 2);
                console.log(i18n.t('messages.insightGained'));
              }
            }
          ]
        };

      case 'realm_trial':
        return {
          id: `realm-trial-${Date.now()}`,
          type: 'combat',
          title: i18n.t('events.realmTrial'),
          description: i18n.t('events.realmTrialDesc', { location: location.name }),
          choices: [
            {
              text: i18n.t('events.faceTrial'),
              effect: () => {
                // Generate a stronger enemy for realm trial
                const enemy = this.combatSystem.generateRandomEnemy();
                // Make enemy stronger for realm trial
                enemy.qi = Math.floor(enemy.qi * 1.5);
                enemy.maxQi = Math.floor(enemy.maxQi * 1.5);
                console.log(i18n.t('messages.realmGuardian', { enemy: enemy.name }));
              }
            }
          ]
        };

      default:
        return {
          id: `realm-opportunity-${Date.now()}`,
          type: 'quest',
          title: i18n.t('events.realmOpportunity'),
          description: i18n.t('events.realmOpportunityDesc', { location: location.name }),
          choices: [
            {
              text: i18n.t('events.enterRealm'),
              effect: () => {
                // Special realm entry logic
                console.log(i18n.t('messages.realmEntered'));
              }
            }
          ]
        };
    }
  }

  /**
   * Generate ancient ruin events
   */
  private generateAncientRuinEvent(location: Location): LocationEvent {
    const eventTypes = ['treasure', 'trap', 'artifact', 'guardian'];
    const eventType = this.random.choice(eventTypes);

    switch (eventType) {
      case 'treasure':
        return {
          id: `ruin-treasure-${Date.now()}`,
          type: 'exploration',
          title: i18n.t('events.ruinTreasure'),
          description: i18n.t('events.ruinTreasureDesc'),
          choices: [
            {
              text: i18n.t('events.searchTreasure'),
              effect: () => {
                // Chance of finding treasure or triggering trap
                if (this.random.chance(0.7)) {
                  console.log(i18n.t('messages.treasureFound'));
                } else {
                  // Trigger trap
                  const damage = Math.floor(this.gameState.player.maxHealth * 0.1);
                  this.gameState.player.health = Math.max(1, this.gameState.player.health - damage);
                  console.log(i18n.t('messages.trapTriggered', { damage }));
                }
              }
            }
          ]
        };

      case 'artifact':
        return {
          id: `ruin-artifact-${Date.now()}`,
          type: 'exploration',
          title: i18n.t('events.ruinArtifact'),
          description: i18n.t('events.ruinArtifactDesc'),
          choices: [
            {
              text: i18n.t('events.examineArtifact'),
              effect: () => {
                // Grant special item or knowledge
                console.log(i18n.t('messages.artifactDiscovered'));
              }
            }
          ]
        };

      case 'guardian':
        return {
          id: `ruin-guardian-${Date.now()}`,
          type: 'combat',
          title: i18n.t('events.ruinGuardian'),
          description: i18n.t('events.ruinGuardianDesc'),
          choices: [
            {
              text: i18n.t('events.confrontGuardian'),
              effect: () => {
                const enemy = this.combatSystem.generateRandomEnemy();
                console.log(i18n.t('messages.guardianAppears', { enemy: enemy.name }));
              }
            },
            {
              text: i18n.t('events.retreat'),
              effect: () => {
                console.log(i18n.t('messages.retreatedSafely'));
              }
            }
          ]
        };

      default: // trap
        return {
          id: `ruin-trap-${Date.now()}`,
          type: 'danger',
          title: i18n.t('events.ruinTrap'),
          description: i18n.t('events.ruinTrapDesc'),
          choices: [
            {
              text: i18n.t('events.disarmTrap'),
              effect: () => {
                if (this.random.chance(0.5)) {
                  console.log(i18n.t('messages.trapDisarmed'));
                } else {
                  const damage = Math.floor(this.gameState.player.maxHealth * 0.15);
                  this.gameState.player.health = Math.max(1, this.gameState.player.health - damage);
                  console.log(i18n.t('messages.trapFailed', { damage }));
                }
              }
            }
          ]
        };
    }
  }

  /**
   * Generate qi absorption event
   */
  private generateQiAbsorptionEvent(location: Location): LocationEvent {
    return {
      id: `qi-${Date.now()}`,
      type: 'cultivation',
      title: i18n.t('events.qiFlow'),
      description: i18n.t('events.qiFlowDesc', { location: location.name }),
      choices: [
        {
          text: i18n.t('events.absorbQi'),
          effect: () => {
            const qiGain = Math.floor(this.gameState.player.maxQi * location.properties.qiDensity * 0.1);
            this.gameState.player.qi = Math.min(this.gameState.player.qi + qiGain, this.gameState.player.maxQi);
            console.log(i18n.t('messages.qiAbsorbed', { qi: qiGain }));
          }
        }
      ]
    };
  }

  /**
   * Get available travel destinations from current location
   */
  public getAvailableDestinations(): Location[] {
    const currentLocation = this.gameState.worldMap.find(loc => loc.id === this.gameState.player.currentLocationId);
    if (!currentLocation) return [];

    return currentLocation.connectedLocations
      .map(path => this.gameState.worldMap.find(loc => loc.id === path.targetLocationId))
      .filter(loc => loc !== undefined) as Location[];
  }

  /**
   * Get location information
   */
  public getLocationInfo(locationId: string): Location | undefined {
    return this.gameState.worldMap.find(loc => loc.id === locationId);
  }

  /**
   * Calculate travel time and cost to a destination
   */
  public getTravelInfo(targetLocationId: string): { time: number; cost: number; danger: number } | null {
    const currentLocation = this.gameState.worldMap.find(loc => loc.id === this.gameState.player.currentLocationId);
    const path = currentLocation?.connectedLocations.find(p => p.targetLocationId === targetLocationId);

    if (!path) return null;

    return {
      time: path.travelTime,
      cost: Math.ceil(path.travelTime / 2),
      danger: path.dangerLevel
    };
  }
}