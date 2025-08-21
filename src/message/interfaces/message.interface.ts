import mongoose from 'mongoose';

export interface Message {
  _id?: string;
  stringContent: string;
  payload: Record<string, any>;
  author?: number | -1;
  isIncoming: boolean;
}
