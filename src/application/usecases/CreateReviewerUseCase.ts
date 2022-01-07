import { ReviewerRepository } from '../../infrastructure/adapters/ReviewerRepository';
import { CreateReviewer } from '../../domain/Services/CreateReviewer';
import { Reviewer } from '../../domain/Entities/Reviewer';
import { UseCaseLogger } from './Logger';

export type CreateReviewerUseCaseOptions = {
  slackId: string;
  githubUsername: string;
};

export class CreateReviewerUseCaseError extends Error { };

export class CreateReviewerUseCase {
  private logger: UseCaseLogger;
  private createReviewerService : CreateReviewer;
 
  constructor(logger: UseCaseLogger, createReviewerService: CreateReviewer) {
    this.logger = logger || console;
    this.createReviewerService = createReviewerService;
  }

  static create(logger: UseCaseLogger): CreateReviewerUseCase {
    return new this(logger, new CreateReviewer(
      new ReviewerRepository()
    ));
  }

  async run({ slackId, githubUsername }: CreateReviewerUseCaseOptions): Promise<Reviewer> {
    try {

      const reviewer = await this.createReviewerService.run(githubUsername, slackId);
      this.logger.info(`Reviewer created. SlackId: ${slackId}, githubUsername: ${githubUsername}`);

      return reviewer;
    } catch (e) {
      throw new CreateReviewerUseCaseError(`Error creating Reviewer: ${e.message}. SlackId: ${slackId}, githubUsername: ${githubUsername}`);
    }
  }
}