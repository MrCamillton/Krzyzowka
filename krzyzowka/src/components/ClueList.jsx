function Section({ title, words, activeWordId, onSelect }) {
  return (
    <>
      <h3>{title}</h3>
      <ul className="clues">
        {words.map((w) => (
          <li key={w.id}>
            <button
              type="button"
              className={`clue ${activeWordId === w.id ? 'clue--active' : ''}`}
              onClick={() => onSelect(w.id)}
            >
              <strong>{w.id}.</strong> {w.clue} <span className="clue__len">({w.answer.length})</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ClueList({ words, activeWordId, onSelect }) {
  const sorted = [...words].sort((a, b) => a.id - b.id);
  return (
    <div className="clue-list">
      <Section title="Poziomo" words={sorted.filter((w) => w.direction === 'across')}
        activeWordId={activeWordId} onSelect={onSelect} />
      <Section title="Pionowo" words={sorted.filter((w) => w.direction === 'down')}
        activeWordId={activeWordId} onSelect={onSelect} />
    </div>
  );
}
