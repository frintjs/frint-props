export function pipe(operator) {
  return function () {
    return operator;
  };
}
