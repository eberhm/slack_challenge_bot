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
        const challenge = this.storage.get(id) || Challenge.createEmpty()
        if (this.storage.has(id)) {
            return Promise.resolve(challenge);
        } else {
            return Promise.reject(new Error(`Challenge with id ${id} not found`));
        }
    }
}
