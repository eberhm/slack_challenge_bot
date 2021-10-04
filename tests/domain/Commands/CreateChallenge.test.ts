import 'jest';
import { CreateChallenge, CreateChallengeCommand } from '../../../src/domain/Commands/CreateChallenge';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';

describe('CreateChallenge Command handler creates a challenge and returns it newly inserted in the DB', () => {

    it('can create a challenge', async () => {
        const ANY_VALID_URL = 'https://valid.url'
        const createChallengeCommand: CreateChallengeCommand = {
            chanllengeUrl: ANY_VALID_URL
        };

        const commandHandler = new CreateChallenge(new InMemoryChallengeRepository());
        const createdChallenge = await commandHandler.run(createChallengeCommand);

        expect(createdChallenge.getId()).toBe(createdChallenge.getUrl());
        expect(createdChallenge.getUrl().toString()).toBe(new URL(createChallengeCommand.chanllengeUrl).toString());
    });
});