import { ReviewerRepository } from '../../Infrastructure/ReviewerRepository';
import { CreateReviewer } from '../../domain/Services/CreateReviewer';
import { Reviewer } from 'src/domain/Entities/Reviewer';

export type CreateReviewerUseCaseOptions = {
  slackId: string;
  githubUsername: string;
};

export class CreateReviewerUseCaseError extends Error { };

export class CreateReviewerUseCase {
  private logger;

  constructor(logger) {
    this.logger = logger || console;
  }

  async run({ slackId, githubUsername }: CreateReviewerUseCaseOptions): Promise<Reviewer> {
    try {
      const service = new CreateReviewer(
        new ReviewerRepository()
      );

      const reviewer = await service.run(githubUsername, slackId);
      this.logger.info(`Reviewer created. SlackId: ${slackId}, githubUsername: ${githubUsername}`);

      return reviewer;
    } catch (e) {
      throw new CreateReviewerUseCaseError(`Error creating Reviewer: ${e.message}. SlackId: ${slackId}, githubUsername: ${githubUsername}`);
    }
  }
}