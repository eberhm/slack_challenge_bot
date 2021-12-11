import { CandidateChallenge } from '../Entities/CandidateChallenge';

export interface CandidateChallengeRepository {
    save(challenge: CandidateChallenge): Promise<CandidateChallenge>;
}
