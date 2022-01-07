import { Repository } from 'typeorm';
import { Challenge } from '../../domain/Entities/Challenge';
import { ChallengeRepository as ChallengeRepositoryPort } from '../../domain/Ports/ChallengeRepository';
import { getRepository } from '../db/connection';
import { Challenge as ChallengeDTO, mapToOrm, buildFromOrm } from '../db/entity/Challenge';


export class ChallengeRepository implements ChallengeRepositoryPort {

    async findById(id: string): Promise<Challenge | undefined > {
        try {
            const result: ChallengeDTO[] = 
            await this.getOrmRepository()
                .then(repo => repo.findByIds([id]));
            return this.mapResult(result);
        } catch (e) {
            throw new Error(`Error finding Challenge with id: ${id} Error: ${e.message}`);
        }
    }

    async findByName(name: string): Promise<Challenge | undefined> {
        try {
            const result = await this.getOrmRepository()
                .then(
                    repo => repo.find({ name })
                );

            if (result.length <= 0) {
                return undefined;
            } else {
                return buildFromOrm(result[0]);   
            }
        } catch (e) {
            throw new Error(`Error finding Challenge with name: ${name} Error: ${e.message}`);
        }
    }

    async findAll(): Promise<Challenge[] | undefined> {
        try {
            return await this.getOrmRepository()
            .then(
                repo => repo.find().then((challenges) => {
                    if (!challenges) {
                        return undefined;
                    }

                    return challenges.map((challenge) => buildFromOrm(challenge));
                }
            ));
        } catch (e) {
            throw new Error(`Error Retrieving all Challenges in the repository: ${e.message}`);
        }
    }

    async save(challenge: Challenge): Promise<Challenge> {
        try {
            await this.getOrmRepository()
                .then(
                    repo => repo.save(mapToOrm(challenge))
                );
            ;
        } catch (e) {
            throw new Error(`Error saving Challenge to DB: ${e.message}`);
        }
        
        return challenge;
    }

    private mapResult(result: ChallengeDTO[]) {
        if (result.length <= 0) {
            return Promise.resolve(undefined);
        } else if (result.length == 1) {
            return Promise.resolve(buildFromOrm(result[0]));
        } else {
            throw new Error(`Found ${result.length} elements: ${JSON.stringify(result)}`);
        }
    }

    private getOrmRepository(): Promise<Repository<ChallengeDTO>> {
        return getRepository(ChallengeDTO);
    }
}
