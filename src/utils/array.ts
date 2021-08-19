/* eslint-disable import/prefer-default-export */
export const uniqueByObjKey = (arr, key) => [
  ...new Map(arr.map(item => [item[key], item])).values(),
];
