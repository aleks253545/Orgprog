export default function sortEx(a, b) {
  if (a.experience > b.experience) return 1;
  if (a.experience === b.experience) return 0;
  if (a.experience < b.experience) return -1;
  throw new Error();
}
