import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { Identifier } from '../ValueObjects/Identifier';
import { CandidateChallengeRepository } from '../Interfaces/CandidateChallengeRepository';
import { Candidate } from '../ValueObjects/Candidate';
import { ReviewerRepository } from '../Interfaces/ReviewerRepository';
import { ChallengeRepository } from '../Interfaces/ChallengeRepository';
import { GithubCodeChallenge } from '../ValueObjects/GithubCodeChallenge';
import { GithubClientInterface } from '../Interfaces/GithubClientInterface';
import { CreateGithubChallenge } from './CreateGithubChallenge';

export class AddReviewersToCodeChallengeError extends Error {}

export class AddReviewersToCodeChallenge {

    private candidateChallengeRepository: CandidateChallengeRepository;
    private reviewersRepository: ReviewerRepository;
    private challengesRepository: ChallengeRepository;
    private githubClient: GithubClientInterface;

    public constructor(
      candidateChallengeRepository: CandidateChallengeRepository,
      reviewersRepository: ReviewerRepository,
      challengesRepository: ChallengeRepository,
      githubClient: GithubClientInterface
    ) {
      this.candidateChallengeRepository = candidateChallengeRepository;
      this.reviewersRepository = reviewersRepository;
      this.challengesRepository = challengesRepository;
      this.githubClient = githubClient;
    }

    public async run(
      ghCodeChallenge: GithubCodeChallenge,
      reviewerIds: Array<Identifier>
    ): Promise<CandidateChallenge> {
      try {

        const [reviewers, challenge] = await Promise.all([
          this.reviewersRepository.findByIds(reviewerIds),
          this.challengesRepository.findById(ghCodeChallenge.getChallengeId()),
        ]);

        await this.githubClient.addReviewersToCodeChallenge(ghCodeChallenge, reviewers);

        const candidateChallenge = this.candidateChallengeRepository.addReviewers(challenge, reviewers);

        return await this.candidateChallengeRepository.save(candidateChallenge);
      } catch (e) {
        throw new AddReviewersToCodeChallengeError(e.message);
      }
    }
}
