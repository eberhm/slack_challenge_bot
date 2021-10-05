import { CandidateChallenge } from "../Entities/CandidateChallenge";
import { Identifier } from "../Interfaces/Identifier";
import CandidateChallengeRepository from "../Interfaces/CandidateChallengeRepository";
import { Candidate } from "../ValueObjects/Candidate";

export class CreateCandidateChallengeError extends Error {};

export class CreateCandidateChallenge {
    private candidateChallengeRepository: CandidateChallengeRepository;

    public constructor(candidateChallengeRepository: CandidateChallengeRepository) {
        this.candidateChallengeRepository = candidateChallengeRepository;
    }

    public async run(
        gitUrl: string,
        reviewerIds: Array<Identifier>,
        candidate: Candidate,
        challengeId: Identifier): Promise<CandidateChallenge> 
    {
        try {
            const challenge = new CandidateChallenge(
                null,
                new URL(gitUrl),
                candidate,
                reviewerIds,
                challengeId
            );
    
            return await this.candidateChallengeRepository.create(challenge);
        } catch (e) {
            throw new CreateCandidateChallengeError(e.message);
        }
    }
}
