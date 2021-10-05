import 'jest';
import { Identifier } from '../../../src/domain/Interfaces/Identifier';
import { CreateCandidateChallenge, CreateCandidateChallengeError } from '../../../src/domain/Services/createCandidateChallenge';
import { CreateChallenge, CreateChallengeError } from '../../../src/domain/Services/CreateChallenge';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { InMemoryCandidateChallengeRepository } from '../../Infrastructure/Repositories/InMemoryCandidateChallengeRepository';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';

describe('CreateCandidateChallenge Service creates a challenge and returns it newly inserted in the DB', () => {

    const ANY_VALID_URL = 'https://valid.url'
    const ANY_ID = { value: ANY_VALID_URL };
    const ANY_GH_USERNAME = 'any_username';
    const candidate = new Candidate(
        new GithubUser(ANY_GH_USERNAME),
        new URL(ANY_VALID_URL)
    );

    it('can create a candidateChallenge', async () => {
        const service = new CreateCandidateChallenge(new InMemoryCandidateChallengeRepository());
        const createdCandidateChallenge = await service.run(ANY_VALID_URL, [ ANY_ID ], candidate, ANY_ID );

        expect(createdCandidateChallenge.getId()).toBe(createdCandidateChallenge.getUrl());
        expect(createdCandidateChallenge.getUrl()).toEqual(new URL(ANY_VALID_URL));
    });


    it('returns a rejected promise if URL is invalid', async () => {
        const ANY_INVALID_URL = 'httpsvalid.url'
        const ANY_ID = { value: ANY_INVALID_URL };
        const service = new CreateCandidateChallenge(new InMemoryCandidateChallengeRepository());

        expect(service.run(ANY_INVALID_URL, [ ANY_ID ], candidate, ANY_ID )).rejects.toBeInstanceOf(CreateCandidateChallengeError);
    });

    it('returns a rejected promise if there is an error calling the repository', async () => {
        const ANY_ERROR_MESSAGE = 'any error message';

        const challengeRepository = new InMemoryCandidateChallengeRepository();
        challengeRepository.create = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));

        const service = new CreateCandidateChallenge(challengeRepository);

        expect(service.run(ANY_VALID_URL, [ ANY_ID ], candidate, ANY_ID )).rejects.toEqual(new CreateCandidateChallengeError(ANY_ERROR_MESSAGE));
    });
});

