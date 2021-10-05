import { CandidateChallenge } from "../Entities/CandidateChallenge";

export default interface CandidateChallengeRepository {
    create(challenge: CandidateChallenge): Promise<CandidateChallenge>;
}