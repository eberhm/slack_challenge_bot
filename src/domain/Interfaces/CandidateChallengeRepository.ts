import { CandidateChallenge } from "../Entities/CandidateChallenge";

export default interface CandidateChallengeRepository {
    save(challenge: CandidateChallenge): Promise<CandidateChallenge>;
}