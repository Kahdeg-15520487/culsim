/**
 * CULSIM - Game Tests
 *
 * Basic tests for the core Game class.
 */

import { Game } from '../core/Game';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  afterEach(() => {
    game.stop();
  });

  test('should initialize with correct default state', () => {
    const state = game.getState();

    expect(state.player.name).toBe('Cultivator');
    expect(state.player.realm).toBe(0); // Mortal
    expect(state.player.qi).toBe(0);
    expect(state.player.maxQi).toBe(100);
    expect(state.player.talent).toBe(50);
    expect(state.time).toBe(0);
    expect(state.isRunning).toBe(false);
  });

  test('should have 12 meridians initialized', () => {
    const state = game.getState();

    expect(state.player.meridians).toHaveLength(12);
    state.player.meridians.forEach(meridian => {
      expect(meridian.isOpen).toBe(false);
      expect(meridian.purity).toBe(0);
    });
  });

  test('should have all elements initialized to 0', () => {
    const state = game.getState();
    const elements = state.player.elements;

    expect(elements.metal).toBe(0);
    expect(elements.wood).toBe(0);
    expect(elements.water).toBe(0);
    expect(elements.fire).toBe(0);
    expect(elements.earth).toBe(0);
  });

  test('should start game loop when started', () => {
    game.start();
    const state = game.getState();

    expect(state.isRunning).toBe(true);
  });
});