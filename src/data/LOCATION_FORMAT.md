# CULSIM Travel System - Location Data Format

The travel system now supports loading location data from JSON files, making it easy to add new locations, modify existing ones, and create custom worlds without changing code.

## File Structure

Location data is stored in `src/data/locations.json`. The file contains a world configuration with locations and their connections.

## JSON Schema

```typescript
interface WorldData {
  startingLocationId: string;  // ID of the player's starting location
  locations: LocationData[];   // Array of all locations in the world
}

interface LocationData {
  id: string;                    // Unique identifier for the location
  type: LocationType;           // Location category (see below)
  name: string;                 // Display name
  description: string;          // Flavor text description
  position: {                   // 2D coordinates for map positioning
    x: number;
    y: number;
  };
  properties: {                 // Location characteristics (0-1 scale)
    safety: number;             // How safe the location is
    qiDensity: number;          // How rich in qi the location is
    eventFrequency: number;     // How often events occur
    merchantPresence: number;   // Chance of finding merchants
    cultivationBonus: number;   // Bonus to cultivation speed
  };
  connectedLocations: TravelPath[]; // Paths to other locations
  discovered?: boolean;         // Whether location starts discovered
  specialFeatures?: string[];   // Optional special features
}

interface TravelPath {
  targetLocationId: string;     // ID of connected location
  travelTime: number;          // Travel time in hours
  dangerLevel: number;         // Risk during travel (0-1)
  description: string;         // Path description
}
```

## Location Types

- `village`: Safe social hubs with merchants and quests
- `cultivation_site`: Peaceful areas for meditation and breakthroughs
- `dangerous_area`: High-risk areas with combat encounters
- `secret_realm`: Mystical areas with realm-specific events
- `ancient_ruin`: Ruins with exploration and treasure events

## Properties Guide

### Safety (0-1)
- `1.0`: Completely safe (peaceful villages)
- `0.8`: Mostly safe (guarded cultivation sites)
- `0.5`: Moderate danger (wild areas)
- `0.2`: Very dangerous (monster-infested areas)
- `0.0`: Extremely perilous (forbidden zones)

### Qi Density (0-1)
- `0.9`: Extremely rich qi (sacred mountains, spirit lakes)
- `0.7`: High qi density (bamboo groves, mountain peaks)
- `0.5`: Moderate qi (forests, ruins)
- `0.3`: Low qi density (villages, towns)
- `0.1`: Very low qi (wastelands)

### Event Frequency (0-1)
- `0.9`: Very eventful (busy villages, active ruins)
- `0.7`: Frequent events (trading posts)
- `0.5`: Moderate events (wild areas)
- `0.3`: Rare events (peaceful cultivation sites)
- `0.1`: Very rare events (isolated areas)

### Merchant Presence (0-1)
- `0.8`: High merchant activity (market towns)
- `0.6`: Moderate merchants (border towns)
- `0.3`: Occasional traders (large villages)
- `0.1`: Rare merchants (remote areas)
- `0.0`: No merchants (wilderness, ruins)

### Cultivation Bonus (0-1)
- `0.4`: Excellent cultivation (spirit lakes, sacred grounds)
- `0.25`: Good cultivation (mountain peaks, bamboo groves)
- `0.15`: Moderate bonus (forests, ruins)
- `0.1`: Slight bonus (villages)
- `0.0`: No bonus (dangerous areas)

## Special Features

Optional array of special features that can affect gameplay:

- `village_center`: Starting point features
- `meditation_spot`: Enhanced meditation events
- `bamboo_formation`: Special bamboo-related events
- `wind_formation`: Wind cultivation bonuses
- `tribulation_site`: Heavenly tribulation events
- `trading_hub`: Enhanced merchant encounters
- `frontier_post`: Border-related events
- `adventurer_guild`: Quest hub
- `ancient_formation`: Special cultivation formations
- `hidden_chamber`: Secret areas in ruins
- `cursed_ground`: Dangerous ruin effects
- `spirit_gateway`: Realm transition points
- `water_formation`: Water cultivation bonuses
- `realm_entrance`: Secret realm access

## Example Location

```json
{
  "id": "crystal-cave",
  "type": "cultivation_site",
  "name": "Crystal Cave",
  "description": "A mystical cave filled with glowing crystals that enhance qi absorption",
  "position": { "x": 3, "y": 1 },
  "properties": {
    "safety": 0.6,
    "qiDensity": 0.8,
    "eventFrequency": 0.4,
    "merchantPresence": 0.0,
    "cultivationBonus": 0.3
  },
  "connectedLocations": [
    {
      "targetLocationId": "mountain-peak",
      "travelTime": 3,
      "dangerLevel": 0.3,
      "description": "Mountain path to Crystal Cave"
    }
  ],
  "specialFeatures": ["crystal_formation", "meditation_spot"]
}
```

## Adding New Locations

1. **Choose a unique ID**: Use kebab-case naming (e.g., `hidden-valley`)
2. **Select appropriate type**: Based on the location's primary purpose
3. **Set meaningful properties**: Balance safety vs. rewards
4. **Position strategically**: Place near related locations
5. **Add connections**: Create bidirectional paths to nearby locations
6. **Add special features**: For unique gameplay elements

## Travel Mechanics

- **Energy Cost**: `travelTime ÷ 2` energy points required
- **Time Advancement**: Travel advances game time by `travelTime` hours
- **Discovery**: Locations become visible after visiting connected areas
- **Danger**: Random encounters possible during travel based on `dangerLevel`

## Event System Integration

Locations generate events based on their properties:
- **Safety**: Affects combat encounter frequency
- **Qi Density**: Influences cultivation and qi absorption events
- **Event Frequency**: Controls how often location events occur
- **Merchant Presence**: Determines trader encounter chances
- **Cultivation Bonus**: Enhances meditation and breakthrough events

This flexible system allows for easy world expansion and modding!