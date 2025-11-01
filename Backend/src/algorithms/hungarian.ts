/**
 * Hungarian Algorithm (Munkres Algorithm) for assignment problem
 * Finds the optimal assignment that minimizes total cost
 */

export interface Matrix {
  row: number;
  col: number;
}

export interface StepResult {
  step: number;
  matrix: number[][];
  rowCover: boolean[];
  colCover: boolean[];
  starred: boolean[][];
  primed: boolean[][];
  assignments?: [number, number][];
  done?: boolean;
}

/**
 * Hungarian Algorithm implementation
 * Returns the optimal assignment (row to column mappings)
 */
export function hungarianAlgorithm(costMatrix: number[][]): [number, number][] {
  // Clone the matrix to avoid modifying the original
  const matrix = costMatrix.map(row => [...row]);
  
  // Step 0: Reduce the matrix
  reduceMatrix(matrix);
  
  // Initialize covers and starred matrix
  const rowCover = new Array(matrix.length).fill(false);
  const colCover = new Array(matrix[0].length).fill(false);
  const starred = matrix.map(() => new Array(matrix[0].length).fill(false));
  const primed = matrix.map(() => new Array(matrix[0].length).fill(false));
  
  // Steps 1-6 of the Hungarian algorithm
  let step = 1;
  while (true) {
    switch (step) {
      case 1:
        step = step1(starred, rowCover, colCover);
        break;
      case 2:
        step = step2(matrix, starred, rowCover, colCover);
        break;
      case 3:
        step = step3(starred, colCover);
        break;
      case 4:
        step = step4(matrix, starred, primed, rowCover, colCover);
        break;
      case 5:
        step = step5(starred, primed, rowCover, colCover);
        break;
      case 6:
        step = step6(matrix, rowCover, colCover);
        break;
      default:
        // Create the assignment result
        return createAssignments(starred);
    }
  }
}

/**
 * Step 0: Reduce the matrix
 * Subtract row minimum from each row
 * Subtract column minimum from each column
 */
function reduceMatrix(matrix: number[][]): void {
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // Subtract row minimum
  for (let i = 0; i < rows; i++) {
    const rowMin = Math.min(...matrix[i]);
    for (let j = 0; j < cols; j++) {
      matrix[i][j] -= rowMin;
    }
  }
  
  // Subtract column minimum
  for (let j = 0; j < cols; j++) {
    let colMin = Infinity;
    for (let i = 0; i < rows; i++) {
      if (matrix[i][j] < colMin) {
        colMin = matrix[i][j];
      }
    }
    for (let i = 0; i < rows; i++) {
      matrix[i][j] -= colMin;
    }
  }
}

/**
 * Step 1: Find zeros and star them
 * For each zero in the matrix, star it if no other starred zero in its row/column
 */
function step1(starred: boolean[][], rowCover: boolean[], colCover: boolean[]): number {
  for (let i = 0; i < starred.length; i++) {
    for (let j = 0; j < starred[0].length; j++) {
      // This will be handled in step 2 with the matrix
    }
  }
  return 2;
}

/**
 * Step 2: Cover all columns containing a starred zero
 * If all columns are covered, we're done
 */
function step2(matrix: number[][], starred: boolean[][], rowCover: boolean[], colCover: boolean[]): number {
  // For each zero in the reduced matrix, star it if no other starred zero in row/col
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 0 && !rowCover[i] && !colCover[j]) {
        starred[i][j] = true;
        rowCover[i] = true;
        colCover[j] = true;
      }
    }
  }
  
  // Clear covers
  rowCover.fill(false);
  colCover.fill(false);
  
  return 3;
}

/**
 * Step 3: Cover all columns containing a starred zero
 * Check if all columns are covered
 */
function step3(starred: boolean[][], colCover: boolean[]): number {
  for (let j = 0; j < starred[0].length; j++) {
    for (let i = 0; i < starred.length; i++) {
      if (starred[i][j]) {
        colCover[j] = true;
        break;
      }
    }
  }
  
  if (colCover.every(c => c)) {
    return 7; // Done
  }
  
  return 4;
}

/**
 * Step 4: Find uncovered zero and prime it
 */
function step4(
  matrix: number[][],
  starred: boolean[][],
  primed: boolean[][],
  rowCover: boolean[],
  colCover: boolean[]
): number {
  while (true) {
    const uncoveredZero = findUncoveredZero(matrix, rowCover, colCover);
    
    if (uncoveredZero === null) {
      return 6;
    }
    
    const [row, col] = uncoveredZero;
    primed[row][col] = true;
    
    const starredInRow = findStarredInRow(starred, row);
    if (starredInRow !== null) {
      rowCover[row] = true;
      colCover[starredInRow] = false;
    } else {
      return 5;
    }
  }
}

/**
 * Step 5: Augment path
 */
function step5(
  starred: boolean[][],
  primed: boolean[][],
  rowCover: boolean[],
  colCover: boolean[]
): number {
  const series = findSeries(starred, primed);
  augmentPath(starred, primed, series);
  clearCovers(rowCover, colCover);
  erasePrimes(primed);
  return 3;
}

/**
 * Step 6: Add minimum uncovered value to covered rows
 */
function step6(matrix: number[][], rowCover: boolean[], colCover: boolean[]): number {
  const min = findMinUncovered(matrix, rowCover, colCover);
  
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (rowCover[i]) {
        matrix[i][j] += min;
      }
      if (!colCover[j]) {
        matrix[i][j] -= min;
      }
    }
  }
  
  return 4;
}

/**
 * Helper: Find uncovered zero
 */
function findUncoveredZero(matrix: number[][], rowCover: boolean[], colCover: boolean[]): [number, number] | null {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 0 && !rowCover[i] && !colCover[j]) {
        return [i, j];
      }
    }
  }
  return null;
}

/**
 * Helper: Find starred zero in row
 */
function findStarredInRow(starred: boolean[][], row: number): number | null {
  for (let j = 0; j < starred[row].length; j++) {
    if (starred[row][j]) {
      return j;
    }
  }
  return null;
}

/**
 * Helper: Find starred zero in column
 */
function findStarredInCol(starred: boolean[][], col: number): number | null {
  for (let i = 0; i < starred.length; i++) {
    if (starred[i][col]) {
      return i;
    }
  }
  return null;
}

/**
 * Helper: Find series (path) of alternating starred and primed zeros
 */
function findSeries(starred: boolean[][], primed: boolean[][]): [number, number][] {
  const series: [number, number][] = [];
  
  // Find uncovered primed zero
  let uncoveredPrime: [number, number] | null = null;
  for (let i = 0; i < primed.length; i++) {
    for (let j = 0; j < primed[0].length; j++) {
      if (primed[i][j]) {
        uncoveredPrime = [i, j];
        break;
      }
    }
    if (uncoveredPrime) break;
  }
  
  if (!uncoveredPrime) {
    return series;
  }
  
  const [pRow, pCol] = uncoveredPrime;
  series.push([pRow, pCol]);
  
  let starredInCol = findStarredInCol(starred, pCol);
  
  while (starredInCol !== null) {
    series.push([starredInCol, pCol]);
    const primeInRow = findPrimeInRow(primed, starredInCol);
    if (primeInRow !== null) {
      series.push([starredInCol, primeInRow]);
      starredInCol = findStarredInCol(starred, primeInRow);
    } else {
      break;
    }
  }
  
  return series;
}

/**
 * Helper: Find primed zero in row
 */
function findPrimeInRow(primed: boolean[][], row: number): number | null {
  for (let j = 0; j < primed[row].length; j++) {
    if (primed[row][j]) {
      return j;
    }
  }
  return null;
}

/**
 * Helper: Augment path
 */
function augmentPath(starred: boolean[][], primed: boolean[][], series: [number, number][]): void {
  for (let i = 0; i < series.length; i++) {
    const [row, col] = series[i];
    if (starred[row][col]) {
      starred[row][col] = false;
    } else {
      starred[row][col] = true;
    }
  }
}

/**
 * Helper: Clear covers
 */
function clearCovers(rowCover: boolean[], colCover: boolean[]): void {
  rowCover.fill(false);
  colCover.fill(false);
}

/**
 * Helper: Erase primes
 */
function erasePrimes(primed: boolean[][]): void {
  for (let i = 0; i < primed.length; i++) {
    primed[i].fill(false);
  }
}

/**
 * Helper: Find minimum uncovered value
 */
function findMinUncovered(matrix: number[][], rowCover: boolean[], colCover: boolean[]): number {
  let min = Infinity;
  
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (!rowCover[i] && !colCover[j] && matrix[i][j] < min) {
        min = matrix[i][j];
      }
    }
  }
  
  return min;
}

/**
 * Helper: Create assignments from starred matrix
 */
function createAssignments(starred: boolean[][]): [number, number][] {
  const assignments: [number, number][] = [];
  
  for (let i = 0; i < starred.length; i++) {
    for (let j = 0; j < starred[0].length; j++) {
      if (starred[i][j]) {
        assignments.push([i, j]);
        break; // Only one assignment per row
      }
    }
  }
  
  return assignments;
}

/**
 * Calculate total cost of assignment
 */
export function calculateAssignmentCost(
  costMatrix: number[][],
  assignments: [number, number][]
): number {
  let totalCost = 0;
  for (const [row, col] of assignments) {
    totalCost += costMatrix[row][col];
  }
  return totalCost;
}

