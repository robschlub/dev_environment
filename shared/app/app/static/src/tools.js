// @flow

export const Console = (text: string) => {
  console.log(text); // eslint-disable-line no-console
};

export function add(a: number, b: number): number {
  return a + b;
}

export function mulToString(a: number, b: number): string {
  return (a * b).toString();
}
// export { Console as default };
