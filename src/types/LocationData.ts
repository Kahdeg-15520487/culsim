/**
 * Location data configuration for the travel system
 * This file defines all locations, their properties, and connections
 */

export interface LocationData {
  id: string;
  type: 'village' | 'cultivation_site' | 'dangerous_area' | 'secret_realm' | 'ancient_ruin';
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
  properties: {
    safety: number; // 0-1 (how safe the location is)
    qiDensity: number; // 0-1 (how rich in qi the location is)
    eventFrequency: number; // 0-1 (how often events occur)
    merchantPresence: number; // 0-1 (chance of finding merchants)
    cultivationBonus: number; // 0-1 (bonus to cultivation speed)
  };
  connectedLocations: Array<{
    targetLocationId: string;
    travelTime: number; // in hours
    dangerLevel: number; // 0-1 (risk of ambush during travel)
    description: string;
  }>;
  discovered?: boolean; // defaults to false for non-starting locations
  specialFeatures?: string[]; // optional special features like "hot_spring", "ancient_formation", etc.
}

export interface WorldData {
  locations: LocationData[];
  startingLocationId: string;
}