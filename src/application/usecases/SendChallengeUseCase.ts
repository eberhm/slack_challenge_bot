import { CandidateChallengeRepository } from '../../Infrastructure/CandidateChallengeRepository';
import { ReviewerRepository } from '../../Infrastructure/ReviewerRepository';
import { AddReviewersToCodeChallenge } from '../../domain/Services/AddReviewersToCodeChallenge';
import { CandidateChallenge } from '../../domain/Entities/CandidateChallenge';
import { CreateCandidateChallenge } from '../../domain/Services/CreateCandidateChallenge';
import { Candidate } from '../../domain/ValueObjects/Candidate';
import { GithubClient } from '../../Infrastructure/GithubClient';
import { SlackId } from '../../domain/ValueObjects/SlackUser';
import { UseCaseLogger } from './Logger';
import { ChallengeRepository as ChallengeRepositoryInterface} from '../../domain/Interfaces/ChallengeRepository';
import { ChallengeRepository } from '../../Infrastructure/ChallengeRepository';

export type SendChallengeUseCaseOptions = {
  candidateName: string;
  challengeName: string;
  githubUser: string;
  resumeUrl: string;
  reviewer1?: SlackId;
  reviewer2?: SlackId;
};

export class SendChallengeUseCaseError extends Error {};

export class SendChallengeUseCase {
  private logger: UseCaseLogger;
  private challengeRepository: ChallengeRepositoryInterface;
  private createCandidateChallengeService: CreateCandidateChallenge;
  private addReviewersToChallengeService: AddReviewersToCodeChallenge;

  constructor(
    logger: UseCaseLogger,
    challengeRepository: ChallengeRepositoryInterface,
    createCandidateChallengeService: CreateCandidateChallenge,
    addReviewersToChallengeService: AddReviewersToCodeChallenge
    ) {
    this.logger = logger || console;
    this.challengeRepository = challengeRepository;
    this.createCandidateChallengeService = createCandidateChallengeService;
    this.addReviewersToChallengeService = addReviewersToChallengeService;
  }

  static create(
    logger: UseCaseLogger
    ) {

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

    return new this(logger, challengeRepository, createCandidateChallengeService, addReviewersToChallengeService);
  }

  async run({ candidateName, challengeName, githubUser, resumeUrl, reviewer1, reviewer2 }: SendChallengeUseCaseOptions): Promise<CandidateChallenge> {
    try {  
      const candidate = Candidate.create(candidateName, githubUser, new URL(resumeUrl));
      const challenge = await this.challengeRepository.findByName(challengeName);
  
      if (!challenge) {
        throw new Error(`Challenge with name: ${challengeName} not found!`);
      }
  
      const candidateChallenge = await this.createCandidateChallengeService.run(candidate, challenge.getId());
  
      this.logger.info(`Candidate Challenge created with id ${candidateChallenge.getId()}`);
  
      await this.addReviewersToCandidateCallenge(candidateChallenge, reviewer1, reviewer2);

      this.logger.info(`Reviewers added to Candidate Challenge with id ${candidateChallenge.getId()}`);
  
      return candidateChallenge;
    } catch(e) {
      throw new SendChallengeUseCaseError(`Error creating candidate challenge: ${e.message}`);
    }
  }

  private async addReviewersToCandidateCallenge(candidateChallenge: CandidateChallenge, reviewer1: string | undefined, reviewer2: string | undefined) {
    let reviewers: SlackId[] = [];
    if (reviewer1) {
      reviewers.push(reviewer1);
    }

    if (reviewer2) {
      reviewers.push(reviewer2);
    }

    if (reviewers.length > 0) {
      await this.addReviewersToChallengeService.run(candidateChallenge, reviewers);
    }
  }
}