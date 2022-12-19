export interface IHash {
  generate(password: string): string;
  compare(password: string, hashPassword: string): boolean;
}
