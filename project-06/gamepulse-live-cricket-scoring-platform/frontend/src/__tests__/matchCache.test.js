import {
  saveMatchCache,
  getMatchCache,
  removeMatchCache,
  clearAllMatchCache,
  getCachedMatchesIndex,
} from '../services/matchCache';

// Mock localStorage for node environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('MatchCache Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saves and retrieves match cache', () => {
    const mockData = {
      scorecard: { teamAName: 'Team Alpha', teamBName: 'Team Beta' },
      commentary: [{ id: 1, text: 'Four!' }],
      analytics: { rrr: 6.5 },
      matchPulse: { momentum: 'Alpha' },
    };

    saveMatchCache(101, mockData);

    const cached = getMatchCache(101);
    expect(cached).not.toBeNull();
    expect(cached.matchId).toBe(101);
    expect(cached.scorecard.teamAName).toBe('Team Alpha');
    expect(cached.commentary.length).toBe(1);
  });

  test('updates cached matches index', () => {
    saveMatchCache(101, { scorecard: { teamAName: 'A', teamBName: 'B' } });
    saveMatchCache(102, { scorecard: { teamAName: 'C', teamBName: 'D' } });

    const index = getCachedMatchesIndex();
    expect(index.length).toBe(2);
    expect(index[0].matchId).toBe(102);
  });

  test('removes match cache', () => {
    saveMatchCache(101, { scorecard: { teamAName: 'A', teamBName: 'B' } });
    removeMatchCache(101);

    expect(getMatchCache(101)).toBeNull();
    expect(getCachedMatchesIndex().length).toBe(0);
  });

  test('clears all match cache', () => {
    saveMatchCache(101, { scorecard: { teamAName: 'A' } });
    saveMatchCache(102, { scorecard: { teamAName: 'B' } });

    clearAllMatchCache();

    expect(getMatchCache(101)).toBeNull();
    expect(getMatchCache(102)).toBeNull();
    expect(getCachedMatchesIndex().length).toBe(0);
  });
});
