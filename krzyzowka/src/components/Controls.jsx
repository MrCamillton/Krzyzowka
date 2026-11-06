export default function Controls({ filled, total, onCheck, onSolve, onClear }) {
  return (
    <div className="controls">
      <button type="button" onClick={onCheck}>Sprawdź</button>
      <button type="button" onClick={onSolve}>Pokaż rozwiązanie</button>
      <button type="button" onClick={onClear}>Wyczyść</button>
      <span className="counter">{`${filled}/${total}`}</span>
    </div>
  );
}