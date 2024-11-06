"use client";

import { useState, useEffect } from "react";

const CrosswordGrid = ({
  answers,
  isHorizontal,
  showAnswers,
}: {
  answers: string[];
  isHorizontal: boolean[];
  showAnswers: boolean;
}) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const gridSize = 28;
  const [firstCells, setFirstCells] = useState<
    { row: number; col: number; horizontal: boolean }[]
  >([]);

  useEffect(() => {
    const newGrid = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill("")
    );
    const newFirstCells: { row: number; col: number; horizontal: boolean }[] =
      [];

    const canPlaceWord = (
      word: string,
      row: number,
      col: number,
      isHorizontal: boolean
    ) => {
      for (let i = 0; i < word.length; i++) {
        const r = isHorizontal ? row : row + i;
        const c = isHorizontal ? col + i : col;

        if (r >= gridSize || c >= gridSize) return false;

        if (newGrid[r][c] && newGrid[r][c] !== word[i]) return false;
      }
      return true;
    };

    const placeWordInGrid = (
      word: string,
      row: number,
      col: number,
      isHorizontal: boolean
    ) => {
      for (let i = 0; i < word.length; i++) {
        const r = isHorizontal ? row : row + i;
        const c = isHorizontal ? col + i : col;
        newGrid[r][c] = word[i];
      }
    };

    answers.forEach((word, index) => {
      let placed = false;
      let startRow, startCol;

      if (index === 0) {
        if (isHorizontal[0]) {
          startCol = Math.floor((gridSize - word.length) / 2);
          startRow = Math.floor(gridSize / 2);
          placeWordInGrid(word, startRow, startCol, true);
        } else {
          startRow = Math.floor((gridSize - word.length) / 2);
          startCol = Math.floor(gridSize / 2);
          placeWordInGrid(word, startRow, startCol, false);
        }
        newFirstCells.push({
          row: startRow,
          col: startCol,
          horizontal: isHorizontal[0],
        });
      } else {
        for (let r = 0; r < gridSize && !placed; r++) {
          for (let c = 0; c < gridSize && !placed; c++) {
            const cell = newGrid[r][c];
            if (cell && word.includes(cell)) {
              const charIndex = word.indexOf(cell);
              startRow = r - (isHorizontal[index] ? 0 : charIndex);
              startCol = c - (isHorizontal[index] ? charIndex : 0);

              if (canPlaceWord(word, startRow, startCol, isHorizontal[index])) {
                placeWordInGrid(word, startRow, startCol, isHorizontal[index]);
                newFirstCells.push({
                  row: startRow,
                  col: startCol,
                  horizontal: isHorizontal[index],
                });
                placed = true;
              }
            }
          }
        }
      }
    });

    setGrid(newGrid);
    setFirstCells(newFirstCells);
  }, [answers, isHorizontal]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid relative"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 2rem)` }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const firstCell = firstCells.find(
              (firstCell) =>
                firstCell.row === rowIndex && firstCell.col === colIndex
            );
            const isHorizontalCell = firstCell?.horizontal;
            const answerNumber =
              firstCells.findIndex(
                (cell) => cell.row === rowIndex && cell.col === colIndex
              ) + 1;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 border ${
                  firstCells.some(
                    (firstCell) =>
                      firstCell.row === rowIndex && firstCell.col === colIndex
                  )
                    ? isHorizontalCell
                      ? `after:content-arrowRightIcon bg-gray-200 after:absolute after:top-0.5 after:-left-1 after:w-2.5 after:h-2.5`
                      : `after:content-arrowDownIcon bg-gray-200 after:absolute after:-top-2.5 after:w-2.5 after:h-2.5`
                    : cell
                    ? "bg-white"
                    : ""
                } flex justify-center items-center relative text-black`}
                style={{
                  visibility: cell ? "visible" : "hidden",
                }}
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
                {showAnswers && cell}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CrosswordGrid;
