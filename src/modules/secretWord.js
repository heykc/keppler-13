const words = [
  'It\'s right behind you',
  'Watch out!',
  'There\'s no way out of this',
  'Scary',
];

export const createWord = (gameState) => {
  const word = words[Math.floor(Math.random() * words.length)];
  const noSpaces = word.replace(/\s/g, '');
  const podIndex = Math.floor(Math.random() * noSpaces.length);
  
  noSpaces.split('').forEach((char) => {
    const code = char.charCodeAt(0);
    const tile = gameState.charMap.get(code);
    tile.color = 'red';
    tile.contains = 'debris'
  });

  const podTile = gameState.charMap.get(noSpaces[podIndex].charCodeAt(0));
  console.log(word, noSpaces[podIndex]);
  podTile.color = 'blue';
  podTile.contains = 'pod';
};