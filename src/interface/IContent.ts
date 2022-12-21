export default interface IContent {
  id: string;
  messages: IMessage[];
}

interface IMessage {
  daySend: string;
  hourSend: string;
  content: string;
  sender: string;
}
