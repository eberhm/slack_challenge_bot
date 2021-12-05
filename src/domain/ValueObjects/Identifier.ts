import { v5 } from "uuid";

const MY_NAMESPACE = "777bff3a-b0f4-4578-a5ab-7ac8a9d0bde5";

export type Identifier = String;
export const generateUuid = (typeString: string) => {
    return v5(typeString, MY_NAMESPACE);
}
