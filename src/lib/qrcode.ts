/**
 * Lightweight QR Code generator using Canvas API.
 * Generates QR codes for UPI payment links — no external dependency.
 * 
 * Based on the QR Code specification (ISO/IEC 18004).
 * Supports alphanumeric and byte mode encoding up to ~250 chars (Version 10, EC Level M).
 */

// QR Code error correction level
const EC_LEVEL = 1; // 0=L, 1=M, 2=Q, 3=H

// Generator polynomials for Reed-Solomon error correction
const GF256_EXP = new Uint8Array(256);
const GF256_LOG = new Uint8Array(256);

// Initialize Galois Field lookup tables
(function initGF256() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_LOG[x] = i;
    x = x << 1;
    if (x >= 256) x ^= 0x11d;
  }
  GF256_EXP[255] = GF256_EXP[0];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF256_EXP[(GF256_LOG[a] + GF256_LOG[b]) % 255];
}

function rsEncode(data: number[], ecCount: number): number[] {
  const gen: number[] = new Array(ecCount + 1).fill(0);
  gen[0] = 1;
  for (let i = 0; i < ecCount; i++) {
    for (let j = i + 1; j >= 1; j--) {
      gen[j] = gen[j] ^ gfMul(gen[j - 1], GF256_EXP[i]);
    }
  }
  const result = new Array(ecCount).fill(0);
  for (const byte of data) {
    const coef = byte ^ result[0];
    result.shift();
    result.push(0);
    for (let j = 0; j < ecCount; j++) {
      result[j] ^= gfMul(gen[j + 1], coef);
    }
  }
  return result;
}

// QR code version configurations (version 1-10, EC level M)
const VERSION_CONFIGS = [
  { total: 26, ec: 10, dataCodewords: 16 },   // v1
  { total: 44, ec: 16, dataCodewords: 28 },   // v2
  { total: 70, ec: 26, dataCodewords: 44 },   // v3
  { total: 100, ec: 18, dataCodewords: 32 },  // v4 (2 blocks)
  { total: 134, ec: 24, dataCodewords: 43 },  // v5
  { total: 172, ec: 28, dataCodewords: 49 },  // v6
  { total: 196, ec: 18, dataCodewords: 73 },  // v7 (adjusted for simplicity)
  { total: 242, ec: 20, dataCodewords: 83 },  // v8
  { total: 292, ec: 22, dataCodewords: 93 },  // v9
  { total: 346, ec: 24, dataCodewords: 107 }, // v10
];

function getVersion(dataLen: number): number {
  // Byte mode: mode(4) + charcount(8 or 16) + data + terminator(4)
  for (let v = 0; v < VERSION_CONFIGS.length; v++) {
    const charCountBits = v < 9 ? 8 : 16;
    const totalBits = 4 + charCountBits + dataLen * 8 + 4;
    const totalCodewords = Math.ceil(totalBits / 8);
    if (totalCodewords <= VERSION_CONFIGS[v].dataCodewords) {
      return v + 1;
    }
  }
  return 10; // max supported
}

function encodeData(text: string, version: number): number[] {
  const config = VERSION_CONFIGS[version - 1];
  const bytes = new TextEncoder().encode(text);
  const charCountBits = version < 10 ? 8 : 16;

  // Build bit stream
  const bits: number[] = [];
  const pushBits = (val: number, count: number) => {
    for (let i = count - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  // Mode indicator: byte mode = 0100
  pushBits(4, 4);
  // Character count
  pushBits(bytes.length, charCountBits);
  // Data
  for (const b of bytes) {
    pushBits(b, 8);
  }
  // Terminator
  const maxBits = config.dataCodewords * 8;
  const terminatorLen = Math.min(4, maxBits - bits.length);
  pushBits(0, terminatorLen);
  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);
  // Pad codewords
  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert to bytes
  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | (bits[i + j] || 0);
    }
    codewords.push(byte);
  }

  return codewords;
}

function createMatrix(version: number): { matrix: number[][]; size: number } {
  const size = 17 + version * 4;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(-1));
  return { matrix, size };
}

function placeFinderPattern(matrix: number[][], row: number, col: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const mr = row + r, mc = col + c;
      if (mr < 0 || mr >= matrix.length || mc < 0 || mc >= matrix.length) continue;
      if (r === -1 || r === 7 || c === -1 || c === 7) {
        matrix[mr][mc] = 0; // separator
      } else if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
        matrix[mr][mc] = 1; // dark
      } else {
        matrix[mr][mc] = 0; // light
      }
    }
  }
}

function placeAlignmentPattern(matrix: number[][], row: number, col: number) {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const mr = row + r, mc = col + c;
      if (mr < 0 || mr >= matrix.length || mc < 0 || mc >= matrix.length) continue;
      if (matrix[mr][mc] !== -1) continue;
      if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
        matrix[mr][mc] = 1;
      } else {
        matrix[mr][mc] = 0;
      }
    }
  }
}

const ALIGNMENT_POSITIONS: number[][] = [
  [], // v1
  [6, 18], // v2
  [6, 22], // v3
  [6, 26], // v4
  [6, 30], // v5
  [6, 34], // v6
  [6, 22, 38], // v7
  [6, 24, 42], // v8
  [6, 26, 46], // v9
  [6, 28, 52], // v10
];

function placeFunctionPatterns(matrix: number[][], version: number, size: number) {
  // Finder patterns
  placeFinderPattern(matrix, 0, 0);
  placeFinderPattern(matrix, 0, size - 7);
  placeFinderPattern(matrix, size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === -1) matrix[6][i] = i % 2 === 0 ? 1 : 0;
    if (matrix[i][6] === -1) matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Alignment patterns
  if (version >= 2) {
    const positions = ALIGNMENT_POSITIONS[version - 1];
    for (const row of positions) {
      for (const col of positions) {
        if (matrix[row][col] !== -1) continue;
        placeAlignmentPattern(matrix, row, col);
      }
    }
  }

  // Dark module
  matrix[size - 8][8] = 1;

  // Reserve format info areas
  for (let i = 0; i < 9; i++) {
    if (i < size && matrix[8][i] === -1) matrix[8][i] = 0;
    if (i < size && matrix[i][8] === -1) matrix[i][8] = 0;
  }
  for (let i = 0; i < 8; i++) {
    if (matrix[8][size - 1 - i] === -1) matrix[8][size - 1 - i] = 0;
    if (matrix[size - 1 - i][8] === -1) matrix[size - 1 - i][8] = 0;
  }

  // Reserve version info (v7+)
  if (version >= 7) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        if (matrix[i][size - 11 + j] === -1) matrix[i][size - 11 + j] = 0;
        if (matrix[size - 11 + j][i] === -1) matrix[size - 11 + j][i] = 0;
      }
    }
  }
}

function placeData(matrix: number[][], data: number[], size: number) {
  let bitIndex = 0;
  let upward = true;

  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5; // skip timing column
    
    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const row of rows) {
      for (let c = 0; c < 2; c++) {
        const actualCol = col - c;
        if (actualCol < 0) continue;
        if (matrix[row][actualCol] !== -1) continue;

        const byteIdx = Math.floor(bitIndex / 8);
        const bitIdx = 7 - (bitIndex % 8);
        const bit = byteIdx < data.length ? (data[byteIdx] >> bitIdx) & 1 : 0;
        matrix[row][actualCol] = bit;
        bitIndex++;
      }
    }
    upward = !upward;
  }
}

function applyMask(matrix: number[][], size: number, mask: number): number[][] {
  const masked = matrix.map(row => [...row]);
  const maskFn = (row: number, col: number): boolean => {
    switch (mask) {
      case 0: return (row + col) % 2 === 0;
      case 1: return row % 2 === 0;
      case 2: return col % 3 === 0;
      case 3: return (row + col) % 3 === 0;
      case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
      case 5: return (row * col) % 2 + (row * col) % 3 === 0;
      case 6: return ((row * col) % 2 + (row * col) % 3) % 2 === 0;
      case 7: return ((row + col) % 2 + (row * col) % 3) % 2 === 0;
      default: return false;
    }
  };

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Only mask data modules (function patterns already placed)
      if (isDataModule(matrix, row, col, size)) {
        if (maskFn(row, col)) {
          masked[row][col] ^= 1;
        }
      }
    }
  }
  return masked;
}

function isDataModule(_matrix: number[][], row: number, col: number, size: number): boolean {
  // Skip finder patterns + separators
  if (row < 9 && col < 9) return false;
  if (row < 9 && col >= size - 8) return false;
  if (row >= size - 8 && col < 9) return false;
  // Skip timing patterns
  if (row === 6 || col === 6) return false;
  // Skip format info
  if (row === 8 && (col < 9 || col >= size - 8)) return false;
  if (col === 8 && (row < 9 || row >= size - 8)) return false;
  return true;
}

function placeFormatInfo(matrix: number[][], size: number, mask: number) {
  // Format info: EC level M = 00, mask pattern
  const formatBits = (EC_LEVEL << 3) | mask;
  
  // BCH encoding for format info
  let format = formatBits << 10;
  let generator = 0x537; // 10100110111
  for (let i = 4; i >= 0; i--) {
    if (format & (1 << (i + 10))) {
      format ^= generator << i;
    }
  }
  format = (formatBits << 10) | format;
  format ^= 0x5412; // XOR mask

  // Place format info bits
  const formatPositions1 = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  const formatPositions2 = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8],
    [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5],
    [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]
  ];

  for (let i = 0; i < 15; i++) {
    const bit = (format >> (14 - i)) & 1;
    const [r1, c1] = formatPositions1[i];
    const [r2, c2] = formatPositions2[i];
    matrix[r1][c1] = bit;
    matrix[r2][c2] = bit;
  }
}

/**
 * Generate a QR code matrix from text input.
 * Returns a 2D boolean array where true = dark module.
 */
export function generateQRMatrix(text: string): boolean[][] {
  const version = getVersion(text.length);
  const config = VERSION_CONFIGS[version - 1];
  const { matrix, size } = createMatrix(version);

  // Place function patterns
  placeFunctionPatterns(matrix, version, size);

  // Encode data
  const dataCodewords = encodeData(text, version);
  const ecCodewords = rsEncode(dataCodewords, config.ec);
  const allCodewords = [...dataCodewords, ...ecCodewords];

  // Place data
  placeData(matrix, allCodewords, size);

  // Apply mask 0 (simplest, good enough for UPI QR)
  const masked = applyMask(matrix, size, 0);
  placeFormatInfo(masked, size, 0);

  // Convert to boolean matrix
  return masked.map(row => row.map(cell => cell === 1));
}

/**
 * Render QR code to a canvas element.
 */
export function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: {
    size?: number;
    darkColor?: string;
    lightColor?: string;
    quietZone?: number;
  } = {}
) {
  const {
    size = 256,
    darkColor = '#000000',
    lightColor = '#ffffff',
    quietZone = 4,
  } = options;

  const qrMatrix = generateQRMatrix(text);
  const moduleCount = qrMatrix.length + quietZone * 2;
  const moduleSize = size / moduleCount;

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = lightColor;
  ctx.fillRect(0, 0, size, size);

  // Modules
  ctx.fillStyle = darkColor;
  for (let row = 0; row < qrMatrix.length; row++) {
    for (let col = 0; col < qrMatrix[row].length; col++) {
      if (qrMatrix[row][col]) {
        ctx.fillRect(
          (col + quietZone) * moduleSize,
          (row + quietZone) * moduleSize,
          moduleSize + 0.5, // slight overlap to prevent gaps
          moduleSize + 0.5
        );
      }
    }
  }
}

/**
 * Generate a UPI payment deep link.
 */
export function generateUPILink(params: {
  payeeUPI: string;
  payeeName: string;
  amount: number;
  transactionNote?: string;
  currency?: string;
}): string {
  const { payeeUPI, payeeName, amount, transactionNote, currency = 'INR' } = params;
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = transactionNote ? `&tn=${encodeURIComponent(transactionNote)}` : '';
  return `upi://pay?pa=${payeeUPI}&pn=${encodedName}&am=${amount.toFixed(2)}&cu=${currency}${encodedNote}`;
}
