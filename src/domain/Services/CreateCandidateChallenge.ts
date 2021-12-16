import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { Identifier } from '../ValueObjects/Identifier';
import { CandidateChallengeRepository } from '../Interfaces/CandidateChallengeRepository';
import { Candidate } from '../ValueObjects/Candidate';
import { ReviewerRepository } from '../Interfaces/ReviewerRepository';
import { ChallengeRepository } from '../Interfaces/ChallengeRepository';
import { GithubCodeChallenge } from '../ValueObjects/GithubCodeChallenge';
import { GithubClientInterface } from '../Interfaces/GithubClientInterface';
import { CreateGithubChallenge } from './CreateGithubChallenge';

export class CreateCandidateChallengeError extends Error {}

export class CreateCandidateChallenge {

    private candidateChallengeRepository: CandidateChallengeRepository;
    private reviewersRepository: ReviewerRepository;
    private challengesRepository: ChallengeRepository;
    private githubClient: GithubClientInterface;
    private createGithubChallenge: CreateGithubChallenge;

    public constructor(
      candidateChallengeRepository: CandidateChallengeRepository,
      reviewersRepository: ReviewerRepository,
      challengesRepository: ChallengeRepository,
      createGithubChallenge: CreateGithubChallenge,
      githubClient: GithubClientInterface
    ) {
      this.candidateChallengeRepository = candidateChallengeRepository;
      this.reviewersRepository = reviewersRepository;
      this.challengesRepository = challengesRepository;
      this.createGithubChallenge = createGithubChallenge;
      this.githubClient = githubClient;
    }

    public async run(
      gitUrl: string,
      reviewerIds: Array<Identifier>,
      candidate: Candidate,
      challengeId: Identifier,
    ): Promise<CandidateChallenge> {
      try {
        const candidateChallengeUrl = new URL(gitUrl);

        const [reviewers, challenge] = await Promise.all([
          this.reviewersRepository.findByIds(reviewerIds),
          this.challengesRepository.findById(challengeId),
        ]);

        let ghCodeChallenge: GithubCodeChallenge;
        if (challenge) {
          ghCodeChallenge = await this.createGithubChallenge.run(
            challenge,
            candidate,
          );
        } else {
          throw new CreateCandidateChallengeError(`Challenge with id: ${challengeId} not found`);
        }

        await this.githubClient.addReviewersToCodeChallenge(ghCodeChallenge, reviewers);

        const candidateChallenge = CandidateChallenge.create(
          candidateChallengeUrl,
          candidate,
          reviewerIds,
          challengeId,
        );

        return await this.candidateChallengeRepository.save(candidateChallenge);
      } catch (e) {
        throw new CreateCandidateChallengeError(e.message);
      }
    }
}
