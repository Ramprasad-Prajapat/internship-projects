// Production Spectator Match Cache Service for Phase 13
const CACHE_PREFIX = 'gamepulse_match_cache_';
const INDEX_KEY = 'gamepulse_cached_matches_index';
const SCHEMA_VERSION = 1;

/**
 * Saves read-only match data (scorecard, commentary, analytics, pulse) to persistent storage.
 */
export const saveMatchCache = (matchId, { scorecard, commentary, analytics, matchPulse }) => {
  if (!matchId) return;
  try {
    const timestamp = new Date().toISOString();
    const cachePayload = {
      schemaVersion: SCHEMA_VERSION,
      matchId,
      cachedAt: timestamp,
      lastUpdated: timestamp,
      scorecard: scorecard || null,
      commentary: commentary || [],
      analytics: analytics || null,
      matchPulse: matchPulse || null,
    };

    localStorage.setItem(`${CACHE_PREFIX}${matchId}`, JSON.stringify(cachePayload));

    // Update index
    updateIndex(matchId, {
      cachedAt: timestamp,
      matchTitle: scorecard
        ? `${scorecard.teamAName || 'Team A'} vs ${scorecard.teamBName || 'Team B'}`
        : `Match #${matchId}`,
    });
  } catch (err) {
    console.warn('Failed to save match data to spectator cache', err);
  }
};

/**
 * Retrieves cached match data for a given match ID.
 */
export const getMatchCache = (matchId) => {
  if (!matchId) return null;
  try {
    const stored = localStorage.getItem(`${CACHE_PREFIX}${matchId}`);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (err) {
    console.error('Failed to read match cache', err);
    return null;
  }
};

/**
 * Removes cached match data for a specific match.
 */
export const removeMatchCache = (matchId) => {
  if (!matchId) return;
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${matchId}`);
    const index = getIndex();
    const newIndex = index.filter((item) => item.matchId !== matchId);
    localStorage.setItem(INDEX_KEY, JSON.stringify(newIndex));
  } catch (err) {
    console.error('Failed to remove match cache', err);
  }
};

/**
 * Clears all cached public match data.
 */
export const clearAllMatchCache = () => {
  try {
    const index = getIndex();
    index.forEach((item) => {
      localStorage.removeItem(`${CACHE_PREFIX}${item.matchId}`);
    });
    localStorage.removeItem(INDEX_KEY);
  } catch (err) {
    console.error('Failed to clear match cache', err);
  }
};

/**
 * Retrieves index of all cached matches available offline.
 */
export const getCachedMatchesIndex = () => {
  return getIndex();
};

const getIndex = () => {
  try {
    const stored = localStorage.getItem(INDEX_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (_e) {
    return [];
  }
};

const updateIndex = (matchId, meta) => {
  const index = getIndex();
  const existingIdx = index.findIndex((i) => i.matchId === matchId);
  const entry = { matchId, ...meta };

  if (existingIdx !== -1) {
    index[existingIdx] = entry;
  } else {
    index.unshift(entry);
  }
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index.slice(0, 20))); // keep max 20 matches in index
  } catch (e) {
    console.warn('Failed to update match cache index', e);
  }
};
