import { normalizeText, computeSimilarityScore, scaleToConfidence } from './util';

describe('Text Utilities', () => {
  test('normalizeText removes punctuation and lowercases', () => {
    expect(normalizeText('Toyota Camry 2020!')).toBe('toyota camry 2020');
  });

  test('computeSimilarityScore gives high score for similar strings', () => {
    const score = computeSimilarityScore('toyota camry hybrid', 'toyota camry hybrid');
    expect(score).toBeGreaterThan(0.9);
  });

  test('scaleToConfidence converts similarity to 0–10 range', () => {
    expect(scaleToConfidence(0.875)).toBe(8.8);
  });
});
