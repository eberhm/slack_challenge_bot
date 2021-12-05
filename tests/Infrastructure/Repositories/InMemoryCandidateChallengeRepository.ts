import { CandidateChallenge } from "../../../src/domain/Entities/CandidateChallenge";
import CandidateChallengeRepository from "../../../src/domain/Interfaces/CandidateChallengeRepository";
import { Identifier } from "../../../src/domain/ValueObjects/Identifier";


export class InMemoryCandidateChallengeRepository implements CandidateChallengeRepository {
    public storage: Map<Identifier, CandidateChallenge> = new Map();

    public async save(candidateChallenge: CandidateChallenge): Promise<CandidateChallenge> {
            try {
                this.storage.set(candidateChallenge.getId(), candidateChallenge);
            } catch (e) {
                return Promise.reject(new Error(`Error saving candidateChallenge: ${e.message}`));
            }    
            return Promise.resolve(candidateChallenge);
    }

    public findById(id: Identifier): Promise<CandidateChallenge> {
        return Promise.resolve(this.storage.get(id));
    }
}
