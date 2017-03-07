export default function (len = 8, prefix = 'dms') {
  const id = [];
  const chars = Math.random().toString(36).substr(2);
  return prefix + Array(len - prefix.length).fill(1).map((i) => {
    return `${chars[Math.floor(Math.random()*chars.length)]}`;
  }).join('');
};
