import { Reviewer } from '../Entities/Reviewer';
import { ReviewerRepository } from '../Interfaces/ReviewerRepository';
import { GithubUser } from '../ValueObjects/GithubUser';
import { SlackUser } from '../ValueObjects/SlackUser';

export class CreateReviewerError extends Error {}

export class CreateReviewer {
    private reviewerRepository: ReviewerRepository;

    public constructor(reviewerRepository: ReviewerRepository) {
      this.reviewerRepository = reviewerRepository;
    }

    public run(githubUsername: string, slackId: string): Promise<Reviewer> {
      const reviewer = Reviewer.create(
        new GithubUser(githubUsername),
        new SlackUser(slackId),
      );

      return this.reviewerRepository.save(reviewer);
    }
}
