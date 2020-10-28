export default interface Storable {
  [key: string]: Storable | any;
}