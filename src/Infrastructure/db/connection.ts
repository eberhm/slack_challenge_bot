import { createConnection, EntityTarget, Repository } from "typeorm";
import connectionOptions from "../../../ormconfig"

export const getConnection = () => createConnection(connectionOptions);
export function getRepository<Entity>(type: EntityTarget<Entity>): Promise<Repository<Entity>> { 
    return getConnection().then((conn) => conn.getRepository(type));
}