import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { Identifier } from '../ValueObjects/Identifier';
import { CandidateChallengeRepository } from '../Interfaces/CandidateChallengeRepository';
import { ReviewerRepository } from '../Interfaces/ReviewerRepository';
import { GithubClientInterface } from '../Interfaces/GithubClientInterface';

export class AddReviewersToCodeChallengeError extends Error {}

export class AddReviewersToCodeChallenge {

    private candidateChallengeRepository: CandidateChallengeRepository;
    private reviewersRepository: ReviewerRepository;
    private githubClient: GithubClientInterface;

    public constructor(
      candidateChallengeRepository: CandidateChallengeRepository,
      reviewersRepository: ReviewerRepository,
      githubClient: GithubClientInterface
    ) {
      this.candidateChallengeRepository = candidateChallengeRepository;
      this.reviewersRepository = reviewersRepository;
      this.githubClient = githubClient;
    }

    public async run(
      candidateChallenge: CandidateChallenge,
      reviewerIds: Array<Identifier>
    ): Promise<CandidateChallenge> {
      try {

        const reviewers = await this.reviewersRepository.findByIds(reviewerIds);

        await this.githubClient.addReviewersToCodeChallenge(candidateChallenge.getCandidateChallengeUrl(), reviewers);

        return this.candidateChallengeRepository.addReviewers(candidateChallenge, reviewers);
      } catch (e) {
        throw new AddReviewersToCodeChallengeError(e.message);
      }
    }
}
