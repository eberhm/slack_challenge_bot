import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { CandidateChallengeRepository } from '../Interfaces/CandidateChallengeRepository';
import { Candidate } from '../ValueObjects/Candidate';
import { GithubClient } from '../Interfaces/GithubClient';
import { Challenge } from '../Entities/Challenge';
import { Reviewer } from '../Entities/Reviewer';

export class CreateCandidateChallengeError extends Error {}

export class CreateCandidateChallenge {
    private candidateChallengeRepository: CandidateChallengeRepository;

    private githubClient: GithubClient;

    public constructor(
      candidateChallengeRepository: CandidateChallengeRepository,
      githubClient: GithubClient,
    ) {
      this.candidateChallengeRepository = candidateChallengeRepository;
      this.githubClient = githubClient;
    }

    public async run(
      candidate: Candidate,
      challenge: Challenge,
      reviewers: Reviewer[]
    ): Promise<CandidateChallenge> {
      try {
        const ghCodeChallenge = await this.githubClient.createChallengeForCandidate(
          challenge,
          candidate,
        );

        await this.githubClient.addReviewersToCodeChallenge(ghCodeChallenge, reviewers);

        const candidateChallenge = CandidateChallenge.create(
          ghCodeChallenge.getUrl(),
          candidate,
          reviewers.map((reviewer) => reviewer.getId()),
          challenge.getId(),
        );

        return await this.candidateChallengeRepository.save(candidateChallenge);
      } catch (e) {
        throw new CreateCandidateChallengeError(e.message);
      }
    }
}
