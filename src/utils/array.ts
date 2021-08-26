/* eslint-disable import/prefer-default-export */
export const uniqueByObjKey = (arr: Array<any>, key: string): Array<any> => [
  ...new Map(arr.map(item => [item[key], item])).values(),
];
