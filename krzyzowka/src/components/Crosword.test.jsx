import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Crossword from './Crossword';

const react5 = [{ id: 1, answer: 'REACT', clue: 'Biblioteka', direction: 'across', row: 0, col: 0 }];

describe('Crossword', () => {
  it('dla hasła na 5 liter wyświetla 5 inputów', () => {
    render(<Crossword words={react5} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(5);
  });

  it('pełna krzyżówka ma 55 pól i licznik 0/55', () => {
    render(<Crossword />);
    expect(screen.getAllByRole('textbox')).toHaveLength(55);
    expect(screen.getByText('0/55')).toBeInTheDocument();
  });

  it('w polu można wpisać tylko jedną literę (druga zastępuje pierwszą)', () => {
    render(<Crossword words={react5} />);
    const input = screen.getByTestId('input-0-0');
    fireEvent.change(input, { target: { value: 'ab' } });
    expect(input).toHaveValue('B');
  });

  it('cyfra nie jest przyjmowana', () => {
    render(<Crossword words={react5} />);
    const input = screen.getByTestId('input-0-0');
    fireEvent.change(input, { target: { value: '5' } });
    expect(input).toHaveValue('');
  });

  it('Sprawdź podświetla poprawne pole na zielono, a błędne na czerwono', async () => {
    const user = userEvent.setup();
    render(<Crossword words={react5} />);
    fireEvent.change(screen.getByTestId('input-0-0'), { target: { value: 'r' } });
    fireEvent.change(screen.getByTestId('input-0-1'), { target: { value: 'x' } });
    await user.click(screen.getByText('Sprawdź'));
    expect(screen.getByTestId('cell-0-0')).toHaveClass('cell--correct');
    expect(screen.getByTestId('cell-0-1')).toHaveClass('cell--wrong');
  });

  it('Pokaż rozwiązanie wypełnia wszystkie pola', async () => {
    const user = userEvent.setup();
    render(<Crossword />);
    await user.click(screen.getByText('Pokaż rozwiązanie'));
    expect(screen.getByText('55/55')).toBeInTheDocument();
    expect(screen.getByTestId('input-0-3')).toHaveValue('F');
  });

  it('Wyczyść resetuje wszystkie pola', async () => {
    const user = userEvent.setup();
    render(<Crossword />);
    await user.click(screen.getByText('Pokaż rozwiązanie'));
    await user.click(screen.getByText('Wyczyść'));
    expect(screen.getByText('0/55')).toBeInTheDocument();
    expect(screen.getByTestId('input-0-3')).toHaveValue('');
  });

  it('kliknięcie definicji podświetla pola hasła (SERWER = 6 pól)', async () => {
    const user = userEvent.setup();
    const { container } = render(<Crossword />);
    await user.click(screen.getByText(/Komputer udostępniający usługi/));
    expect(container.querySelectorAll('.cell--highlight')).toHaveLength(6);
    expect(screen.getByTestId('cell-2-3')).toHaveClass('cell--active');
  });
});