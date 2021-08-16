const createKey = (name) => ({
  name,
  codes: name.split('').map((char) => char.charCodeAt(0))
});

const keys = [
  createKey('Qq'),
  createKey('Ww'),
  createKey('Ee'),
  createKey('Rr'),
  createKey('Tt'),
  createKey('Yy'),
  createKey('Uu'),
  createKey('Ii'),
  createKey('Oo'),
  createKey('Pp'),
  createKey('Aa'),
  createKey('Ss'),
  createKey('Dd'),
  createKey('Ff'),
  createKey('Gg'),
  createKey('Hh'),
  createKey('Jj'),
  createKey('Kk'),
  createKey('Ll'),
  createKey(':;"\''),
  createKey('Zz'),
  createKey('Xx'),
  createKey('Cc'),
  createKey('Vv'),
  createKey('Bb'),
  createKey('Nn'),
  createKey('Mm'),
  createKey(','),
  createKey('.'),
  createKey('?!'),
];

const Tile = ({ name, size, row, col, base = 0, color = '#e1e1e1' }) => ({
  name: name[0],
  color,
  row,
  col,
  x: base + (size * 1.15 * col),
  y: base + (size * 1.15 * row),
  w: size,
  h: size,
  contains: null,
});

export const createTiles = () => {
  const tiles = [];
  const charMap = new Map();
  let rowMax = 10;
  let colMax = 3;
  for(let colIndex = 0; colIndex < colMax; colIndex++) {
    for(let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
      const keyIndex = rowMax * colIndex + rowIndex;
      const tile = Tile({
        name: keys[keyIndex].name,
        size: 25,
        row: colIndex,
        col: rowIndex,
      });
      keys[keyIndex].codes.forEach((code) => {
        charMap.set(code, tile);
      });
      tiles.push(tile);
    }
  }

  return {
    tiles,
    charMap,
  };
};