import { useMemo, useRef, useState } from 'react';
import { WORDS } from '../data/words';
import { buildGrid, getGridSize, getWordKeys, sanitizeLetter } from '../utils/grid';
import Cell from './Cell';
import ClueList from './ClueList';
import Controls from './Controls';

export default function Crossword({ words = WORDS }) {
  const cells = useMemo(() => buildGrid(words), [words]);
  const { rows, cols } = useMemo(() => getGridSize(cells), [cells]);
  const total = Object.keys(cells).length;

  const [letters, setLetters] = useState({});   // { 'r-c': 'A' }
  const [results, setResults] = useState({});   // { 'r-c': 'correct' | 'wrong' }
  const [activeWordId, setActiveWordId] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const inputRefs = useRef({});

  const activeWord = words.find((w) => w.id === activeWordId);
  const activeKeys = activeWord ? getWordKeys(activeWord) : [];
  const filled = Object.keys(letters).length;

  const focusCell = (key) => inputRefs.current[key]?.focus();

  const handleFocus = (key) => {
    setActiveKey(key);
    // jeśli bieżące hasło nie zawiera tego pola, wybieramy pierwsze hasło przechodzące przez pole
    if (!activeKeys.includes(key)) setActiveWordId(cells[key].wordIds[0]);
  };

  const handleChange = (key, raw) => {
    const letter = sanitizeLetter(raw);
    if (raw !== '' && letter === '') return; // cyfra / znak specjalny -> ignorujemy

    setLetters((prev) => {
      const next = { ...prev };
      if (letter) next[key] = letter;
      else delete next[key];
      return next;
    });
    // edycja pola kasuje jego podświetlenie z "Sprawdź"
    setResults((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });

    // automatyczny przeskok do następnego pola hasła
    if (letter) {
      const idx = activeKeys.indexOf(key);
      if (idx >= 0 && idx < activeKeys.length - 1) focusCell(activeKeys[idx + 1]);
    }
  };

  const handleKeyDown = (e, key) => {
    if (e.key === 'Backspace' && !letters[key]) {
      const idx = activeKeys.indexOf(key);
      if (idx > 0) focusCell(activeKeys[idx - 1]);
    }
  };

  const handleSelectWord = (id) => {
    setActiveWordId(id);
    const first = getWordKeys(words.find((w) => w.id === id))[0];
    setActiveKey(first);
    focusCell(first);
  };

  const handleCheck = () => {
    const next = {};
    Object.values(cells).forEach((c) => {
      const v = letters[c.key];
      if (v) next[c.key] = v === c.solution ? 'correct' : 'wrong';
    });
    setResults(next);
  };

  const handleSolve = () => {
    const solved = {};
    Object.values(cells).forEach((c) => { solved[c.key] = c.solution; });
    setLetters(solved);
    setResults({});
  };

  const handleClear = () => {
    setLetters({});
    setResults({});
    setActiveWordId(null);
    setActiveKey(null);
  };

  return (
    <div className="crossword">
      <h2>Krzyżówka</h2>
      <div className="crossword__layout">
        <div>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, 34px)`,
              gridTemplateRows: `repeat(${rows}, 34px)`,
            }}
          >
            {Object.values(cells).map((cell) => (
              <Cell
                key={cell.key}
                cell={cell}
                value={letters[cell.key]}
                status={results[cell.key]}
                highlighted={activeKeys.includes(cell.key)}
                active={activeKey === cell.key}
                onChange={handleChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                inputRef={(el) => { inputRefs.current[cell.key] = el; }}
              />
            ))}
          </div>
          <Controls filled={filled} total={total}
            onCheck={handleCheck} onSolve={handleSolve} onClear={handleClear} />
        </div>
        <ClueList words={words} activeWordId={activeWordId} onSelect={handleSelectWord} />
      </div>
    </div>
  );
}