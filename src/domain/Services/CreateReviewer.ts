import { Reviewer } from '../Entities/Reviewer';
import { ReviewerRepository } from '../Ports/ReviewerRepository';
import { GithubUser } from '../ValueObjects/GithubUser';
import { SlackUser } from '../ValueObjects/SlackUser';

export class CreateReviewerError extends Error {}

export class CreateReviewer {
    private reviewerRepository: ReviewerRepository;

    public constructor(reviewerRepository: ReviewerRepository) {
      this.reviewerRepository = reviewerRepository;
    }

    public async run(githubUsername: string, slackId: string): Promise<Reviewer> {
      try {
        const reviewer = Reviewer.create(
          new GithubUser(githubUsername),
          new SlackUser(slackId),
        );
  
        return this.reviewerRepository.save(reviewer);
      } catch (e) {
        throw new CreateReviewerError(`Error in CreateReviewer Service. Error: ${e.message}`);
      }
    }
}
