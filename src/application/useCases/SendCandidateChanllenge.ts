import { CandidateChallenge } from "../../domain/Entities/CandidateChallenge";
import { CreateCandidateChallenge } from "../../domain/Services/CreateCandidateChallenge";
import { SlackUser } from "../../domain/ValueObjects/SlackUser";

export class SendCandidateChallenge {
    async run(
        candidateGithubName: string,
        challengeName: string,
        reviewers: string[]
    ): Promise<CandidateChallenge> {
        const reviewersRepository = new InMemoryReviewerRepository();
        const candidateChallengeRepository = new InMemoryCandidateChallengeRepository();
        const challengeRepository = new InMemoryChallengeRepository();
        const githubClient = new SandboxedGithubClient();
        let reviewer: Reviewer, challenge: Challenge = null;

    
        const reviewerSlackUsers = reviewers.map((slackId) => (new SlackUser(slackId)))
        reviewers = await reviewersRepository.findBySlackUsers(reviewerSlackUsers);
    
        const createChallengeService = new CreateChallenge(challengeRepository, githubClient);
        challenge = await createChallengeService.run(ANY_VALID_CHALLENGE_NAME, ANY_VALID_URL);
    

        const service = new CreateCandidateChallenge(
            candidateChallengeRepository,
            reviewersRepository,
            challengeRepository,
            githubClient
        );

        const createdCandidateChallenge = await service.run(
            candidateGithubName, 
            reviewers, 
            ANY_VALID_CANDIDATE, 
            challenge.getId()
        );

        return createdCandidateChallenge;
    }
}