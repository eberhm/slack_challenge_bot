import { createConnection, EntityTarget, Repository } from "typeorm";
import connectionOptions from "../../../ormconfig"

const reposCache = new Map();

export const connection = createConnection(connectionOptions);
export function getRepository<Entity>(type: EntityTarget<Entity>): Promise<Repository<Entity>> { 
    
    if (!reposCache.has(type)) {
        reposCache.set(type, connection.then((conn) => conn.getRepository(type)));
    }

    return reposCache.get(type);
}