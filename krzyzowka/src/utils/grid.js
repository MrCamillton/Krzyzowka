export const cellKey = (row, col) => `${row}-${col}`;

export function getWordPositions(word) {
  return Array.from(word.answer).map((letter, i) => ({
    letter,
    row: word.direction === 'across' ? word.row : word.row + i,
    col: word.direction === 'across' ? word.col + i : word.col,
  }));
}

export function getWordKeys(word) {
  return getWordPositions(word).map((p) => cellKey(p.row, p.col));
}

export function buildGrid(words) {
  const cells = {};
  words.forEach((word) => {
    getWordPositions(word).forEach(({ row, col, letter }, i) => {
      const key = cellKey(row, col);
      if (!cells[key]) {
        cells[key] = { key, row, col, solution: letter, number: null, wordIds: [] };
      } else if (cells[key].solution !== letter) {
        throw new Error(`Konflikt liter w polu ${key} (hasło ${word.id})`);
      }
      cells[key].wordIds.push(word.id);
      if (i === 0) cells[key].number = word.id;
    });
  });
  return cells;
}

export function getGridSize(cells) {
  const list = Object.values(cells);
  return {
    rows: Math.max(...list.map((c) => c.row)) + 1,
    cols: Math.max(...list.map((c) => c.col)) + 1,
  };
};

export function sanitizeLetter(value) {  const chars = Array.from(value ?? '');
  const last = chars[chars.length - 1];
  if (!last) return '';

  const normalized = last.normalize('NFC');
  const allowed = /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŻżŹź]$/u;
  return allowed.test(normalized) ? normalized.toLocaleUpperCase('pl') : '';
}