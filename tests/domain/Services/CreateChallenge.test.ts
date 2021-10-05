import 'jest';
import { CreateChallenge, CreateChallengeError } from '../../../src/domain/Services/CreateChallenge';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';

describe('CreateChallenge Service creates a challenge and returns it newly inserted in the DB', () => {

    it('can create a challenge', async () => {
        const ANY_VALID_URL = 'https://valid.url'

        const commandHandler = new CreateChallenge(new InMemoryChallengeRepository());
        const createdChallenge = await commandHandler.run(ANY_VALID_URL);

        expect(createdChallenge.getId()).toBe(createdChallenge.getUrl());
        expect(createdChallenge.getUrl().toString()).toBe(new URL(ANY_VALID_URL).toString());
    });


    it('returns a rejected promise if URL is invalid', async () => {
        const ANY_INVALID_URL = 'httpsvalid.url'
        const commandHandler = new CreateChallenge(new InMemoryChallengeRepository());

        expect(commandHandler.run(ANY_INVALID_URL)).rejects.toBeInstanceOf(CreateChallengeError);
    });

    it('returns a rejected promise if there is an error calling the repository', async () => {
        const ANY_VALID_URL = 'https://valid.url';
        const ANY_ERROR_MESSAGE = 'any error message';

        const challengeRepository = new InMemoryChallengeRepository();
        challengeRepository.create = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));
        
        const commandHandler = new CreateChallenge(challengeRepository);

        expect(commandHandler.run(ANY_VALID_URL)).rejects.toEqual(new CreateChallengeError(ANY_ERROR_MESSAGE));
    });
});