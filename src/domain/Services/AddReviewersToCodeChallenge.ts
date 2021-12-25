import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { Identifier } from '../ValueObjects/Identifier';
import { CandidateChallengeRepository } from '../Interfaces/CandidateChallengeRepository';
import { ReviewerRepository } from '../Interfaces/ReviewerRepository';
import { GithubClientInterface } from '../Interfaces/GithubClientInterface';
import { SlackId } from '../ValueObjects/SlackUser';

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
      reviewerIds: Array<SlackId>
    ): Promise<CandidateChallenge> {
      try {

        const reviewers = await this.reviewersRepository.findBySlackIds(reviewerIds);

        if (!Array.isArray(reviewers) || reviewers.length <= 0 ) {
          throw new Error(`Reviewers not found: ${reviewerIds.concat(', ') }`);
        }

        await this.githubClient.addReviewersToCodeChallenge(candidateChallenge.getCandidateChallengeUrl(), reviewers);

        return this.candidateChallengeRepository.addReviewers(candidateChallenge, reviewers);
      } catch (e) {
        throw new AddReviewersToCodeChallengeError(e.message);
      }
    }
}
