import { CandidateChallengeRepository } from '../../Infrastructure/CandidateChallengeRepository';
import { ChallengeRepository } from '../../Infrastructure/ChallengeRepository';
import { ReviewerRepository } from '../../Infrastructure/ReviewerRepository';
import { AddReviewersToCodeChallenge } from '../../domain/Services/AddReviewersToCodeChallenge';
import { CandidateChallenge } from '../../domain/Entities/CandidateChallenge';
import { CreateCandidateChallenge } from '../../domain/Services/CreateCandidateChallenge';
import { Candidate } from '../../domain/ValueObjects/Candidate';
import { GithubClient } from '../../Infrastructure/GithubClient';
import { SlackId } from 'src/domain/ValueObjects/SlackUser';

export type SendChallengeUseCaseOptions = {
  candidateName: string;
  challengeName: string;
  githubUser: string;
  resumeUrl: string;
  reviewer1: SlackId;
  reviewer2: SlackId;
};

export class SendChallengeUseCaseError extends Error {};

export class SendChallengeUseCase {
  private logger;

  constructor(logger) {
    this.logger = logger || console;
  }

  async run({ candidateName, challengeName, githubUser, resumeUrl, reviewer1, reviewer2 }: SendChallengeUseCaseOptions): Promise<CandidateChallenge> {
    try {

      const challengeRepository = new ChallengeRepository();
      const githubClient = new GithubClient();
      const candidateChallengeRepository = new CandidateChallengeRepository();
      const reviewersRepository = new ReviewerRepository();
  
      const createCandidateChallengeService = new CreateCandidateChallenge(
        candidateChallengeRepository,
        challengeRepository,
        githubClient
      );
  
      const addReviewersToChallengeService = new AddReviewersToCodeChallenge(
        candidateChallengeRepository,
        reviewersRepository,
        githubClient
      );
  
      const candidate = Candidate.create(candidateName, githubUser, new URL(resumeUrl));
      const challenge = await challengeRepository.findByName(challengeName);
  
      if (!challenge) {
        throw new Error(`Challenge with name: ${challengeName} not found!`);
      }
  
      const candidateChallenge = await createCandidateChallengeService.run(candidate, challenge.getId());
  
      this.logger.info(`Candidate Challenge created with id ${candidateChallenge.getId()}`);
  
      await addReviewersToChallengeService.run(candidateChallenge, [ reviewer1, reviewer2 ]);
  
      this.logger.info(`Reviewers added to Candidate Challenge with id ${candidateChallenge.getId()}`);
  
      return candidateChallenge;
    } catch(e) {
      throw new SendChallengeUseCaseError(`Error creating candidate challenge: ${e.message}`);
    }
  }
}