/* eslint-disable import/prefer-default-export */
export const uniqueByObjKey = (arr: Array<any>, key: string): Array<any> => [
  ...new Map(arr.map(item => [item[key], item])).values(),
];

export function uniqueMap<T, K>(
  array: Array<T>,
  mapFunction: (item: T) => K | undefined
): Array<K> {
  return [...new Set(array.map(mapFunction))].filter(value => value) as Array<
    K
  >;
}
