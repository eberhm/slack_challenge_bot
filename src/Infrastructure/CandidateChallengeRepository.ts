import { CandidateChallenge } from '../../src/domain/Entities/CandidateChallenge';
import { Reviewer } from '../../src/domain/Entities/Reviewer';
import { CandidateChallengeRepository as CandidateChallengeRepositoryInterface } from '../domain/Interfaces/CandidateChallengeRepository';
import { getRepository } from './db/connection';
import { CandidateChallenge as CandidateChallengeDTO, mapToOrm } from './db/entity/CandidateChallenge';


export class CandidateChallengeRepository implements CandidateChallengeRepositoryInterface {

    addReviewers(candidateChallenge: CandidateChallenge, reviewers: Reviewer[]): Promise<CandidateChallenge> {
        candidateChallenge.setReviewerIds(
            reviewers.map(
                (reviewer) => reviewer.getId()
            )
        );

        return this.save(candidateChallenge);
    }

    async save(candidateChallenge: CandidateChallenge): Promise<CandidateChallenge> {
        try {
            await this.getOrmRepository()
                .then(
                    repository => repository.save(
                        mapToOrm(candidateChallenge)
                    )
                );
        } catch (e) {
            throw new Error(`Error saving CandidateChallenge to DB: ${e.message}`);
        }
        
        return candidateChallenge;
    }

    private async getOrmRepository() {
       return getRepository(CandidateChallengeDTO);
    }
}
