import { Connection, createConnection, EntityTarget, Repository } from 'typeorm';
import connectionOptions from '../../../ormconfig';

const reposCache = new Map();
let conn: Promise<Connection> | undefined = undefined;

const getConnection = (): Promise<Connection> | undefined => {
    if (conn) {
        return conn;
    }

    conn = createConnection(connectionOptions);
    return conn;
};

export async function getRepository<Entity>(type: EntityTarget<Entity>): Promise<Repository<Entity>> { 
    
    if (!reposCache.has(type)) {
        const connection = getConnection() as Promise<Connection>;
        reposCache.set(type, connection.then((cn) => cn.getRepository(type)));
    }

    return reposCache.get(type);
}