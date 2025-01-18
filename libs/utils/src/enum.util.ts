export const enumToArray = <T extends object>(myEnum: T): (keyof T)[] =>
  Object.keys(myEnum).filter((key) => isNaN(Number(key))) as (keyof T)[];
