export interface Message {
  _id?: string;
  stringContent: string;
  payload: any;
  author: number;
  isIncoming: boolean;
}
