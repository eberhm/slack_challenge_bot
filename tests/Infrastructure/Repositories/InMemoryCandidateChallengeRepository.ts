import { CandidateChallenge } from "../../../src/domain/Entities/CandidateChallenge";
import { Challenge } from "../../../src/domain/Entities/Challenge";
import CandidateChallengeRepository from "../../../src/domain/Interfaces/CandidateChallengeRepository";
import { Identifier } from "../../../src/domain/Interfaces/Identifier";

export interface InMemoryCandidateChallengeIdentifier extends Identifier {
    value: URL
};

export class InMemoryCandidateChallengeRepository implements CandidateChallengeRepository {
    public storage: WeakMap<InMemoryCandidateChallengeIdentifier, CandidateChallenge> = new WeakMap();

    public async create(candidateChallenge: CandidateChallenge): Promise<CandidateChallenge> {
            const id = { value: candidateChallenge.getUrl() };
            const newChallenge = new CandidateChallenge(
                id, 
                candidateChallenge.getUrl(),
                candidateChallenge.getCandidate(),
                candidateChallenge.getReviewerIds(),
                candidateChallenge.getChallengeId()
                )
            this.storage.set(id, candidateChallenge);
    
            return Promise.resolve(newChallenge);
    }

    public findById(id: InMemoryCandidateChallengeIdentifier): Promise<CandidateChallenge> {
        return Promise.resolve(this.storage.get(id));
    }
}
