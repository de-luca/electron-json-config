/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface Storable {
  [key: string]: Storable | any;
}