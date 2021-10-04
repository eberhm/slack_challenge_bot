import 'jest';
import { CreateReviewer, CreateReviewerCommand, CreateReviewerError } from '../../../src/domain/Commands/createReviewer';
import { InMemoryReviewerRepository } from '../../Infrastructure/Repositories/InMemoryReviewerRepository';

describe('CreateReviewer Command handler creates a reviewer and returns it newly inserted in the DB', () => {

    it('can create a reviewer', async () => {

        const createReviewerCommand: CreateReviewerCommand = {
            githubUsername: 'any_username',
            slackId: 12465
        };

        const commandHandler = new CreateReviewer(new InMemoryReviewerRepository());
        const createdReviewer = await commandHandler.run(createReviewerCommand);

        expect(createdReviewer.getId()).toBe(createdReviewer.getGithubUser());
        expect(createdReviewer.getGithubUser().getUsername()).toBe(createReviewerCommand.githubUsername);
        expect(createdReviewer.getSlackUser().getUserId()).toBe(createReviewerCommand.slackId);
    });

    it('returns a rejected promise if there is an error calling the repository', async () => {
        const ANY_ERROR_MESSAGE = 'any error message';
        const createReviewerCommand: CreateReviewerCommand = {
            githubUsername: 'any_username',
            slackId: 12465
        };

        const reviewerRepository = new InMemoryReviewerRepository();
        reviewerRepository.create = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));
        const commandHandler = new CreateReviewer(reviewerRepository);

        expect(commandHandler.run(createReviewerCommand)).rejects.toEqual(new CreateReviewerError(ANY_ERROR_MESSAGE));
    });
});
