import 'jest';
import { CreateReviewer, CreateReviewerCommand } from '../../../src/domain/Commands/createReviewer';
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
});
