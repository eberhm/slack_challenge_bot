import 'jest';
import { CreateChallenge, CreateChallengeCommand, CreateChallengeError } from '../../../src/domain/Commands/CreateChallenge';
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


    it('returns a rejected promise if URL is invalid', async () => {
        const ANY_INVALID_URL = 'httpsvalid.url'
        const createChallengeCommand: CreateChallengeCommand = {
            chanllengeUrl: ANY_INVALID_URL
        };

        const commandHandler = new CreateChallenge(new InMemoryChallengeRepository());

        expect(commandHandler.run(createChallengeCommand)).rejects.toBeInstanceOf(CreateChallengeError);
    });

    it('returns a rejected promise if there is an error calling the repository', async () => {
        const ANY_VALID_URL = 'https://valid.url';
        const ANY_ERROR_MESSAGE = 'any error message';
        const createChallengeCommand: CreateChallengeCommand = {
            chanllengeUrl: ANY_VALID_URL
        };

        const challengeRepository = new InMemoryChallengeRepository();
        challengeRepository.create = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));
        
        const commandHandler = new CreateChallenge(challengeRepository);

        expect(commandHandler.run(createChallengeCommand)).rejects.toEqual(new CreateChallengeError(ANY_ERROR_MESSAGE));
    });
});