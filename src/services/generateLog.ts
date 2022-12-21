import fs from 'fs';
import { ILog } from '../interface/IData';

export default class ServiceLog {
  private readonly fileLog = fs;
  private nameFile: string = __dirname.split('/src')[0] + '/src/assets/logs';

  constructor() {}

  public async formatMessage({ from, status, log, to }: ILog): Promise<string> {
    const data = new Date();

    return `${data}; [${log}]; from: ${from}; ${to ? 'to: ' + to : ''} ${status && `[${status}]`}\n`;
  }

  public async saveLog(Props: ILog): Promise<void> {
    const message = await this.formatMessage({ ...Props });
    this.fileLog.appendFileSync(`${this.nameFile}/access.log`, message);
  }
}

// Converter o ip para address de email
