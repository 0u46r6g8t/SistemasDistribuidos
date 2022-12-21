import IContent from '../interface/IContent';
import { IDataPrivate } from '../interface/IData';

export default class ServiceContent {
  private readonly dbMessage: IContent[] = [];

  constructor() {}

  public saveMessage = ({ to, content, from }: IDataPrivate) => {
    const userMessage: IContent = this.getUser(to);
    if (userMessage !== undefined) {
        let dFormat = new Date().toJSON().split(".")[0].split("T")

        userMessage.messages.push({
            content,
            daySend: dFormat[0],
            hourSend: dFormat[1],
            sender: from,
        });

        return userMessage
    }
    return undefined;
  };

  public createObject = ({ to }: IDataPrivate) => {
    const IdAlready = this.dbMessage.filter(item => item.id === to && item)[0];
    if(!IdAlready) {
        this.dbMessage.push({ id: to, messages: [] });
    }
    console.log(IdAlready, this.dbMessage);
  };

  public getMessage = ({ to }: IDataPrivate) => {
    return this.dbMessage.filter(item => item.id === to)
  }

  public getUser = (user: string) => {
    const data = this.dbMessage.filter(
      (item: IContent) => item.id === user && item
    )[0]
    return data;
  };
}
