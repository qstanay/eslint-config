export function bad() {
  console.log('debug');
  debugger;
  const value = 1 == 1;
  return value;
}
