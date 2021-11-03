// eslint-disable-next-line
export const recursiveParseBigint = obj =>
  Object.entries(obj).reduce(
    (acum, [key, val]) => {
      console.log('recursing', key, val);
      if (val instanceof Object && !(typeof val === 'function')) {
        const res = Array.isArray(val)
          ? val.map(el => recursiveParseBigint(el))
          : recursiveParseBigint(val);
        return { ...acum, [key]: res };
      }
      if (typeof val === 'bigint') {
        return { ...acum, [key]: val.toString() };
      }
      return { ...acum, [key]: val };
    },
    { ...obj }
  );
