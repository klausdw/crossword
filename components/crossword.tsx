"use client";

import { useState, useEffect } from "react";
import classNames from "classnames";

type Cell = {
  char: string;
  count: number;
};

type WordPosition = {
  word: string;
  row: number;
  col: number;
  isHorizontal: boolean;
  locked: boolean;
};

const CrosswordGrid = ({
  answers,
  isHorizontal,
  showAnswers,
  backgroundColor,
}: {
  answers: string[];
  isHorizontal: boolean[];
  showAnswers: boolean;
  backgroundColor: string;
}) => {
  const [grid, setGrid] = useState<Cell[][]>(
    Array.from({ length: 28 }, () => Array(28).fill({ char: "", count: 0 }))
  );
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);
  const [_, setDragging] = useState(false);
  const gridSize = 28;
  const [firstCells, setFirstCells] = useState<WordPosition[]>([]);

  const canPlaceWord = (
    grid: Cell[][],
    word: string,
    row: number,
    col: number,
    isHorizontal: boolean
  ) => {
    for (let i = 0; i < word.length; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;

      if (r >= gridSize || c >= gridSize) return false;

      if (grid[r][c].char && grid[r][c].char !== word[i]) return false;
    }
    return true;
  };

  const placeWordInGrid = (
    grid: Cell[][],
    word: string,
    row: number,
    col: number,
    isHorizontal: boolean
  ) => {
    for (let i = 0; i < word.length; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;

      if (!grid[r][c].char) {
        grid[r][c] = { char: word[i], count: 1 };
      } else {
        grid[r][c].count += 1;
      }
    }
  };

  const clearWordFromGrid = (
    grid: Cell[][],
    word: string,
    row: number,
    col: number,
    isHorizontal: boolean
  ) => {
    for (let i = 0; i < word.length; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;

      if (grid[r][c].char === word[i]) {
        if (grid[r][c].count > 1) {
          grid[r][c].count -= 1;
        } else {
          grid[r][c] = { char: "", count: 0 };
        }
      }
    }
  };

  useEffect(() => {
    const newGrid: Cell[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill({ char: "", count: 0 })
    );

    const positions: WordPosition[] = [];

    answers.forEach((word, index) => {
      if (wordPositions[index] && wordPositions[index].locked) {
        const { row, col, isHorizontal } = wordPositions[index];
        placeWordInGrid(newGrid, word, row, col, isHorizontal);
        positions.push(wordPositions[index]);
        return;
      }

      let placed = false;
      if (index === 0) {
        const startRow = Math.floor(gridSize / 2);
        const startCol = Math.floor((gridSize - word.length) / 2);
        placeWordInGrid(newGrid, word, startRow, startCol, isHorizontal[index]);
        positions.push({
          word,
          row: startRow,
          col: startCol,
          isHorizontal: isHorizontal[index],
          locked: false,
        });
      } else {
        for (let r = 0; r < gridSize && !placed; r++) {
          for (let c = 0; c < gridSize && !placed; c++) {
            const cell = newGrid[r][c];
            if (cell.char && word.includes(cell.char)) {
              const charIndex = word.indexOf(cell.char);
              const startRow = r - (isHorizontal[index] ? 0 : charIndex);
              const startCol = c - (isHorizontal[index] ? charIndex : 0);

              if (
                canPlaceWord(
                  newGrid,
                  word,
                  startRow,
                  startCol,
                  isHorizontal[index]
                )
              ) {
                placeWordInGrid(
                  newGrid,
                  word,
                  startRow,
                  startCol,
                  isHorizontal[index]
                );
                positions.push({
                  word,
                  row: startRow,
                  col: startCol,
                  isHorizontal: isHorizontal[index],
                  locked: false,
                });
                placed = true;
              }
            }
          }
        }
      }
    });

    setGrid(newGrid);
    setFirstCells(positions);
    setWordPositions(positions);
  }, [answers, isHorizontal]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    setSelectedCells((prevSelectedCells) => {
      const newSelectedCells = new Set(prevSelectedCells);
      newSelectedCells.has(cellKey)
        ? newSelectedCells.delete(cellKey)
        : newSelectedCells.add(cellKey);
      return newSelectedCells;
    });
  };

  const handleMouseDown = (row: number, col: number) => {
    const wordIndex = wordPositions.findIndex((pos) => {
      const { word, row: wordRow, col: wordCol, isHorizontal, locked } = pos;
      if (locked) return false;
      if (isHorizontal) {
        return wordRow === row && col >= wordCol && col < wordCol + word.length;
      } else {
        return wordCol === col && row >= wordRow && row < wordRow + word.length;
      }
    });

    if (wordIndex !== -1) {
      setSelectedWordIndex(wordIndex);
      setDragging(true);
    }
  };

  const handleMouseUp = (row: number, col: number) => {
    if (selectedWordIndex !== null) {
      const {
        word,
        isHorizontal,
        row: oldRow,
        col: oldCol,
      } = wordPositions[selectedWordIndex];
      const matchingLetter = grid[row][col].char;

      if (matchingLetter && word.includes(matchingLetter)) {
        const charIndex = word.indexOf(matchingLetter);
        const startRow = row - (isHorizontal ? 0 : charIndex);
        const startCol = col - (isHorizontal ? charIndex : 0);

        if (canPlaceWord(grid, word, startRow, startCol, isHorizontal)) {
          const newGrid = Array.from(grid, (row) => [...row]);

          clearWordFromGrid(newGrid, word, oldRow, oldCol, isHorizontal);

          placeWordInGrid(newGrid, word, startRow, startCol, isHorizontal);
          setGrid(newGrid);

          const newPositions = [...wordPositions];
          newPositions[selectedWordIndex] = {
            ...newPositions[selectedWordIndex],
            row: startRow,
            col: startCol,
          };
          setWordPositions(newPositions);
          setFirstCells(newPositions);
        }
      }
      setSelectedWordIndex(null);
    }
    setDragging(false);
  };

  const handleMouseEnterWord = (index: number) => setHoveredWordIndex(index);
  const handleMouseLeaveWord = () => setHoveredWordIndex(null);

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid relative"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 2rem)` }}
        onMouseUp={() => setDragging(false)}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;
            const firstCell = firstCells.find(
              (firstCell) =>
                firstCell.row === rowIndex && firstCell.col === colIndex
            );
            const isHorizontalCell = firstCell?.isHorizontal;
            const answerNumber =
              firstCells.findIndex(
                (cell) => cell.row === rowIndex && cell.col === colIndex
              ) + 1;
            const isFirstCell = firstCells.some(
              (firstCell) =>
                firstCell.row === rowIndex && firstCell.col === colIndex
            );

            const isHovered =
              hoveredWordIndex !== null &&
              wordPositions[hoveredWordIndex] &&
              !wordPositions[hoveredWordIndex].locked &&
              (wordPositions[hoveredWordIndex].isHorizontal
                ? rowIndex === wordPositions[hoveredWordIndex].row &&
                  colIndex >= wordPositions[hoveredWordIndex].col &&
                  colIndex <
                    wordPositions[hoveredWordIndex].col +
                      wordPositions[hoveredWordIndex].word.length
                : colIndex === wordPositions[hoveredWordIndex].col &&
                  rowIndex >= wordPositions[hoveredWordIndex].row &&
                  rowIndex <
                    wordPositions[hoveredWordIndex].row +
                      wordPositions[hoveredWordIndex].word.length);

            return (
              <div
                key={cellKey}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={classNames(
                  "w-8 h-8 border select-none flex justify-center items-center relative text-black uppercase",
                  {
                    "cursor-pointer hover:bg-gray-200": cell,
                    "text-transparent": selectedCells.has(cellKey),
                    "bg-white": !selectedCells.has(cellKey),
                    "after:content-arrowRightIcon after:absolute after:top-0.5 after:-left-0.5 after:w-2.5 after:h-2.5":
                      isFirstCell && isHorizontalCell,
                    "after:content-arrowDownIcon after:absolute after:-top-2.5 after:w-2.5 after:h-2.5":
                      isFirstCell && !isHorizontalCell,
                  }
                )}
                style={{
                  visibility: cell.char ? "visible" : "hidden",
                  backgroundColor:
                    isFirstCell || selectedCells.has(cellKey)
                      ? backgroundColor
                      : undefined,
                  borderColor: isHovered ? "#1a3a1a" : undefined,
                }}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseUp={() => handleMouseUp(rowIndex, colIndex)}
                onMouseEnter={() =>
                  handleMouseEnterWord(
                    wordPositions.findIndex((pos) =>
                      pos.isHorizontal
                        ? rowIndex === pos.row &&
                          colIndex >= pos.col &&
                          colIndex < pos.col + pos.word.length
                        : colIndex === pos.col &&
                          rowIndex >= pos.row &&
                          rowIndex < pos.row + pos.word.length
                    )
                  )
                }
                onMouseLeave={handleMouseLeaveWord}
              >
                {firstCell ? (
                  <span
                    className={`${
                      isHorizontalCell
                        ? "absolute -top-0.5 left-0 text-xs font-bold text-black"
                        : "absolute -top-0.5 left-0 text-xs font-bold text-black"
                    }`}
                  >
                    {answerNumber}
                  </span>
                ) : null}
                {showAnswers && cell.char}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CrosswordGrid;
