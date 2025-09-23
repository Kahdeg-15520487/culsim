# CULSIM - Cultivation Simulator

🏛️ **Chinese cultivation mythology-inspired incremental game with roguelike elements**

Players start as mortal souls with no cultivation talent and progress through multiple lifetimes, carrying over benefits from life events and cultivation achievements.

## Features

- **8 Cultivation Realms**: From Mortal to Immortal Ascension
- **5 Elements System**: Metal, Wood, Water, Fire, Earth with generating/controlling cycles
- **Roguelike Elements**: Reincarnation with persistent benefits
- **Combat System**: Deterministic melee + probabilistic ranged combat
- **Life Events**: Random encounters that permanently enhance cultivation potential
- **Artifact System**: Craftable items that persist through reincarnations
- **Alchemy System**: Pill creation for temporary boosts and permanent cultivation aids

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd culsim

# Install dependencies
npm install
```

### Development
```bash
# Build the project
npm run build

# Run the game
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Development mode (watch for changes)
npm run dev
```

## Project Structure

```
src/
├── core/           # Core game systems (cultivation, elements, combat)
├── entities/       # Game entities (player, enemies, artifacts)
├── events/         # Life events and random encounters
├── ui/            # User interface components
├── utils/         # Game utilities and helpers
└── types/         # TypeScript type definitions
```

## Development Guidelines

### Code Style
- TypeScript with strict mode enabled
- Comprehensive type definitions
- Immutable state updates
- Comprehensive test coverage

### Testing
- Unit tests for all core systems
- Integration tests for complex interactions
- Property-based testing for game mechanics

### Architecture Principles
- Separation of transient (current life) and persistent (soul) state
- Immutable state updates for game progression
- Comprehensive validation of state transitions

## Game Mechanics

### Cultivation System
Players progress through 8 realms, each with specific advancement criteria and quality requirements involving elements, artifacts, alchemy pills, and rituals.

### Element Complementarity
Each mortal soul starts with an element affinity and gradually completes the 5-element cycle through cultivation realms.

### Reincarnation
Death triggers (natural end, combat, voluntary) allow players to reincarnate with persistent benefits from life events and cultivation achievements.

## Contributing

1. Follow the established code style and architecture patterns
2. Add comprehensive tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## License

ISC License

## Roadmap

See `IMPLEMENTATION_PLAN.md` for detailed development roadmap and timeline.