import { randomUUID } from 'crypto';

export type Identifier = string;
export const generateUuid = ():Identifier => randomUUID();
