import { Challenge } from "../../../src/domain/Entities/Challenge";
import ChallengeRepository from "../../../src/domain/Interfaces/ChallengeRepository";
import { Identifier } from "../../../src/domain/Interfaces/Identifier";

export interface InMemoryChallengeIdentifier extends Identifier {
    value: URL
};

export class InMemoryChallengeRepository implements ChallengeRepository {
    public storage: WeakMap<InMemoryChallengeIdentifier, Challenge> = new WeakMap();

    public create(challenge: Challenge): Promise<Challenge> {
        const id = { value: challenge.getUrl() };
        const newChallenge = new Challenge(id, challenge.getUrl())
        this.storage.set(id, challenge);

        return Promise.resolve(newChallenge);
    }

    public findById(id: InMemoryChallengeIdentifier): Promise<Challenge> {
        return Promise.resolve(this.storage.get(id));
    }
}
