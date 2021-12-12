import 'jest';
import { CreateReviewer, CreateReviewerError } from '../../../src/domain/Services/createReviewer';
import { InMemoryReviewerRepository } from '../../Infrastructure/Repositories/InMemoryReviewerRepository';

describe('CreateReviewer Service creates a reviewer and returns it newly inserted in the DB', () => {
    const ANY_GITHUB_USERNAME = 'any_username';
    const ANY_SLACK_ID = 'any_slack_id';

    it('can create a reviewer', async () => {

        const commandHandler = new CreateReviewer(new InMemoryReviewerRepository());
        const createdReviewer = await commandHandler.run(ANY_GITHUB_USERNAME, ANY_SLACK_ID);

        expect(createdReviewer.getId()).not.toBe(null);
        expect(createdReviewer.getGithubUser().getUsername()).toBe(ANY_GITHUB_USERNAME);
        expect(createdReviewer.getSlackUser().getUserId()).toBe(ANY_SLACK_ID);
    });

    it('returns a rejected promise if there is an error calling the repository', async () => {
        const ANY_ERROR_MESSAGE = 'any error message';


        const reviewerRepository = new InMemoryReviewerRepository();
        reviewerRepository.save = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));
        const commandHandler = new CreateReviewer(reviewerRepository);

        expect(commandHandler.run(ANY_GITHUB_USERNAME, ANY_SLACK_ID)).rejects.toEqual(new CreateReviewerError(ANY_ERROR_MESSAGE));
    });
});
