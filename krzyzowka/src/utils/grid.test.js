import { describe, it, expect } from 'vitest';
import { WORDS } from '../data/words';
import { buildGrid, sanitizeLetter } from './grid';

describe('sanitizeLetter', () => {
  it('zamienia literę na wielką', () => expect(sanitizeLetter('a')).toBe('A'));
  it('obsługuje polskie znaki', () => {
    expect(sanitizeLetter('ą')).toBe('Ą');
    expect(sanitizeLetter('ł')).toBe('Ł');
    expect(sanitizeLetter('ż')).toBe('Ż');
  });
  it('odrzuca cyfry', () => expect(sanitizeLetter('5')).toBe(''));
  it('przy dwóch literach zostawia ostatnią', () => expect(sanitizeLetter('ab')).toBe('B'));
});

describe('buildGrid', () => {
  it('buduje 55 pól dla pełnej krzyżówki', () => {
    expect(Object.keys(buildGrid(WORDS))).toHaveLength(55);
  });
  it('rzuca błąd, gdy hasła krzyżują się na różnych literach', () => {
    const bad = [
      { id: 1, answer: 'ABC', direction: 'across', row: 0, col: 0, clue: '' },
      { id: 2, answer: 'XYZ', direction: 'down', row: 0, col: 0, clue: '' },
    ];
    expect(() => buildGrid(bad)).toThrow();
  });
});