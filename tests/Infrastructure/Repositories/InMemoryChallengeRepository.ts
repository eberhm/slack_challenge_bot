import { Challenge } from "../../../src/domain/Entities/Challenge";
import { ChallengeRepository } from "../../../src/domain/Interfaces/ChallengeRepository";
import { Identifier } from "../../../src/domain/ValueObjects/Identifier";

export class InMemoryChallengeRepository implements ChallengeRepository {
    public storage: Map<Identifier, Challenge> = new Map();

    public save(challenge: Challenge): Promise<Challenge> {
        try {
            this.storage.set(challenge.getId(), challenge);    
        } catch(e) {
            return Promise.reject(new Error(`Error saving Challenge: ${e.message}`));
        }

        return Promise.resolve(challenge);
    }

    public findById(id: Identifier): Promise<Challenge> {
        return Promise.resolve(this.storage.get(id));
    }

    public findByName(name: string): Promise<Challenge> {
        let found: Challenge;

        this.storage.forEach((challenge) => {
            if (challenge.getName() === name) {
                found = challenge;
            }
        });

        return Promise.resolve(found);
    }
}
