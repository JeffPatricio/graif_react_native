export const simpleHash = (level = 1) => {
  const hash = [];
  for (let i = 0; i < level; i++) hash.push(Math.random().toString(36).substr(2, 9));
  return hash.join('');
}