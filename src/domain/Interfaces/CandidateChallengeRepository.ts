import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { Reviewer } from '../Entities/Reviewer';

export interface CandidateChallengeRepository {
    addReviewers(candidateChallenge: CandidateChallenge, reviewers: Reviewer[]): Promise<CandidateChallenge>;
    save(challenge: CandidateChallenge): Promise<CandidateChallenge>;
}
