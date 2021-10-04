import { Reviewer } from "../Entities/Reviewer";
import ReviewerRepository from "../Interfaces/ReviewerRepository";
import { GithubUser } from "../ValueObjects/GithubUser";
import { SlackUser } from "../ValueObjects/SlackUser";

export class CreateReviewerCommand {
    public githubUsername: string;
    public slackId: number;
}

export class CreateReviewer {
    private reviewerRepository: ReviewerRepository;

    public constructor(reviewerRepository: ReviewerRepository) {
        this.reviewerRepository = reviewerRepository;
    }

    public run(command: CreateReviewerCommand) {
        const reviewer = new Reviewer(
            null,
            new GithubUser(command.githubUsername),
            new SlackUser(command.slackId)
        );

        return this.reviewerRepository.create(reviewer);
    }
}