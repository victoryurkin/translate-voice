/**
 * Saves an item to the browser local storage. The value could be of any type, it will be converted to the string
 * @param key - local storage key
 * @param value - value to be saved
 */
export const set = (key: string, value: unknown) => {
  if (key.trim() !== '' && value !== undefined && value !== null) {
    try {
      const str = JSON.stringify(value);
      window.localStorage.setItem(key, str);
    } catch (error) {
      const str = value as string;
      window.localStorage.setItem(key, str);
    }
  }
};

/**
 * Gets an item from the browser local storage. The method will try to convert the result to a type with JSON.parse, in case convertion is not successfull the method will return a string.
 * @param key - local storage key
 * @returns unknown
 * @example const result = get('myKey') as boolean;
 */
export const get = (key: string): unknown => {
  const value = window.localStorage.getItem(key);
  if (key.trim() !== '' && value !== undefined && value !== null) {
    try {
      const obj = JSON.parse(value);
      return obj;
    } catch (error) {
      return value;
    }
  }
  return undefined;
};

/**
 * Removes an item from the local storage
 * @param key - local storage key
 */
export const remove = (key: string) => {
  if (key.trim() !== '') {
    window.localStorage.removeItem(key);
  }
};

/**
 * Removes all items saved to local storage
 */
export const clear = () => {
  window.localStorage.clear();
};
