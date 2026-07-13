import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMatchScore, normalizeList, normalizeText } from './matching.js';

test('normalizes case when comparing subjects for matching', () => {
  const user = {
    areasOfStrength: ['Math', 'Science'],
    areasOfDevelopment: ['History', 'English'],
  };

  const tutor = {
    areasOfStrength: ['HISTORY', 'ENGLISH'],
    areasOfDevelopment: ['math', 'SCIENCE'],
  };

  assert.equal(calculateMatchScore(user, tutor), 100);
});

test('normalizes lists for case-insensitive matching and search', () => {
  assert.deepEqual(normalizeList(['Math', 'Science', '']), ['math', 'science']);
  assert.equal(normalizeText('  MATH  '), 'math');
});
