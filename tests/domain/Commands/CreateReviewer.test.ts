import 'jest';
import { CreateReviewer, CreateReviewerCommand } from '../../../src/domain/Commands/createReviewer';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';


import ReviewerRepository from '../../../src/domain/Interfaces/ReviewerRepository';

const ANY_ID = { value: 12345 };

class InMemoryReviewerRepository implements ReviewerRepository {
    public create(reviewer: Reviewer): Reviewer {
        return new Reviewer(ANY_ID, reviewer.getGithubUser(), reviewer.getSlackUser());
    }    
}

describe('CreateReviewer Command handler creates a reviewer and returns it newly inserted in the DB', () => {

    it('can create a reviewer', () => {

        const createReviewerCommand: CreateReviewerCommand = {
            githubUsername: 'any_username',
            slackId: 12465
        };

        const commandHandler = new CreateReviewer(new InMemoryReviewerRepository());

        const createdReviewer = commandHandler.run(createReviewerCommand);
        expect(createdReviewer.getId()).toBe(ANY_ID.value);
        expect(createdReviewer.getGithubUser().getUsername()).toBe(createReviewerCommand.githubUsername);
        expect(createdReviewer.getSlackUser().getUserId()).toBe(createReviewerCommand.slackId);
    });
});
