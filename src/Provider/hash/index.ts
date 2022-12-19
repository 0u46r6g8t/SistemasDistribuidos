import bcrypt from "bcrypt";
import { IHash } from "../interface/hash";

export class HashProvider implements IHash {
  private readonly saltGen: any;

  constructor() {
    this.saltGen = bcrypt.genSaltSync(5);
  }

  generate(password: string): string {
    const hash = bcrypt.hashSync(password, this.saltGen);
    return hash;
  }

  compare(password: string, hashPassword: string): boolean {
    const hashCompare = bcrypt.compareSync(password, hashPassword);

    return hashCompare;
  }
}
