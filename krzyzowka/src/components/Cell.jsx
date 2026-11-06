export default function Cell({
  cell, value, status, highlighted, active,
  onChange, onFocus, onKeyDown, inputRef,
}) {
  const classes = ['cell'];
  if (highlighted) classes.push('cell--highlight'); // niebieski
  if (status) classes.push(`cell--${status}`);      // correct (zielony) / wrong (czerwony)
  if (active) classes.push('cell--active');         // żółty (kursor)

  return (
    <div
      className={classes.join(' ')}
      data-testid={`cell-${cell.row}-${cell.col}`}
      style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
    >
      {cell.number && <span className="cell__number">{cell.number}</span>}
      <input
        ref={inputRef}
        data-testid={`input-${cell.row}-${cell.col}`}
        aria-label={`Wiersz ${cell.row + 1}, kolumna ${cell.col + 1}`}
        value={value || ''}
        autoComplete="off"
        autoCapitalize="characters"
        inputMode="text"
        maxLength={1}
        pattern="[A-Za-zĄąĆćĘęŁłŃńÓóŚśŻżŹź]"
        onChange={(e) => onChange(cell.key, e.target.value)}
        onFocus={() => onFocus(cell.key)}
        onKeyDown={(e) => onKeyDown(e, cell.key)}
      />
    </div>
  );
}