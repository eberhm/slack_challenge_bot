import 'jest';
import { CreateChallenge, CreateChallengeError } from '../../../src/domain/Services/CreateChallenge';
import { InMemoryChallengeRepository } from '../../infrastructure/adapters/InMemoryChallengeRepository';
import { SandboxedGithubClient } from '../../infrastructure/adapters/SandboxedGithubClient';

describe('CreateChallenge Service creates a challenge and returns it after storing it', () => {
    let githubClient, challengeRepository;

    const ANY_VALID_NAME = 'any_valid_name';
    const ANY_VALID_URL = 'https://valid.url';
    const ANY_INVALID_URL = 'httpsvalid.url';

    beforeEach(() => {
        githubClient = new SandboxedGithubClient();
        challengeRepository = new InMemoryChallengeRepository();
    });

    afterEach(() => jest.restoreAllMocks());

    it('can create a challenge', async () => {
        const service = new CreateChallenge(challengeRepository, githubClient);
        const createdChallenge = await service.run(ANY_VALID_NAME, ANY_VALID_URL);

        expect(createdChallenge.getId()).not.toBe(null);
        expect(createdChallenge.getUrl().toString()).toBe(new URL(ANY_VALID_URL).toString());
        expect(createdChallenge.getName()).toBe(ANY_VALID_NAME);
    });


    it('returns a rejected promise if URL is invalid', async () => {
        const service = new CreateChallenge(challengeRepository, githubClient);

        expect(service.run(ANY_VALID_NAME, ANY_INVALID_URL)).rejects.toBeInstanceOf(CreateChallengeError);
    });

    it('returns a rejected promise if there is an error using the repository', async () => {
        const ANY_ERROR_MESSAGE = 'any error message';

        challengeRepository.save = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));
        
        const service = new CreateChallenge(challengeRepository, githubClient);

        expect(service.run(ANY_VALID_NAME, ANY_VALID_URL)).rejects.toEqual(new CreateChallengeError(ANY_ERROR_MESSAGE));
    });

    it('returns a rejected promise if the URL is not a valid Github repository', async () => {
        githubClient.githubRepositoryExists = jest.fn().mockResolvedValue(false);
        const service = new CreateChallenge(challengeRepository, githubClient);

        expect(service.run(ANY_VALID_NAME, ANY_VALID_URL)).rejects.toEqual(new CreateChallengeError(
            `${ANY_VALID_URL} is not a valid Github Repository URL`
        ));

        githubClient.githubRepositoryExists.mockRestore();
    });
});