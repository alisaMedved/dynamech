/** utils for async operations **/
// @ts-ignore
import path from "path";
// @ts-ignore
import fs from "fs";
import {logger} from "../logs.config";
import {faker} from "@faker-js/faker";

export const sleep = async (s: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.round(1000 * s)));

/** utils for generation unique id **/

export const generateUniqueId = (): number => {
  const workerNumber = process.env.TEST_PARALLEL_INDEX
    ? process.env.TEST_PARALLEL_INDEX
    : "0";
  const uniqueId = Math.floor(Date.now() % 1000000000);
  const workerUniqueId = uniqueId + Number(workerNumber) * 100000000;
  return Math.floor(workerUniqueId % 1000000000);
};

/** utils with Enum **/

type EnumKeyList<T> = (keyof T)[];
type EnumValuesList<T> = T[keyof T][];

export function enumToArray<T>(enumObject: T, keysOrValues: string): EnumKeyList<T> | EnumValuesList<T> {
  const array = Object.keys(enumObject);
  const resultLength = array.length / 2;
  switch (keysOrValues) {
    case "keys":
      return array.slice(resultLength, resultLength * 2) as EnumKeyList<T>
    case "values":
      return array.slice(0, resultLength) as EnumValuesList<T>
    default:
      throw new Error("Unknown keysOrValues");
  }
}

/** utils with Array and Set **/

export const randomElement = (array: string | any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export function randomElements<T>(list: T[], amountOfItems: number = list.length): T[] {
  if (amountOfItems == 0) return [];
  if (amountOfItems == list.length) return list;
  if (amountOfItems > list.length)
    throw new Error(
        `amountOfItems > array.length (amountOfItems = ${amountOfItems} ; array.length  = ${list.length})`,
    );

  let enabledOptions = new Array(...list);
  let result: T[] = [];
  for (let i = 0; i < amountOfItems; i++) {
    const randomIndex = Math.floor(Math.random() * enabledOptions.length);
    const elm = enabledOptions[randomIndex];
    result.push(elm);
    enabledOptions.splice(randomIndex, 1);
  }

  return result;
}

/** utils with files **/

export async function readDataFromFile(
    pathToFile: string,
    isAbsolute: boolean = false,
): Promise<any> {
  let dataFromFile: any;
  const additionalPath = {
    shared: '../../',
  };
  let formatedPath: string = '';

  if (isAbsolute) {
    formatedPath = pathToFile;
  } else {
    const highDirectoryOfFile = `${pathToFile}`.split('/')[0];
    formatedPath = path.join(__dirname, `${additionalPath[highDirectoryOfFile]}${pathToFile}`);
  }
  logger.info(`formatedPath: ${formatedPath}`);
  logger.info(`__dirname: ${__dirname}`);
  const fsPromises = fs.promises;
  return await fsPromises
      .readFile(formatedPath, { encoding: 'utf8' })
      .then((data) => {
        dataFromFile = JSON.parse(data);
        return dataFromFile;
      })
      .catch(() => {
        throw new Error('File does not exist');
      });
}
