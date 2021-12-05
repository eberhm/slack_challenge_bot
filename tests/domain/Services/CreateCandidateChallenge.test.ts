import 'jest';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { CreateCandidateChallenge, CreateCandidateChallengeError } from '../../../src/domain/Services/createCandidateChallenge';
import { CreateChallenge } from '../../../src/domain/Services/CreateChallenge';
import { CreateReviewer } from '../../../src/domain/Services/createReviewer';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { InMemoryCandidateChallengeRepository } from '../../Infrastructure/Repositories/InMemoryCandidateChallengeRepository';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';
import { InMemoryReviewerRepository } from '../../Infrastructure/Repositories/InMemoryReviewerRepository';
import { SandboxedGithubClient } from '../../Infrastructure/Repositories/SandboxedGithubClient';

describe('CreateCandidateChallenge Service creates a challenge and returns it newly inserted in the DB', () => {

    const ANY_ID = 'any_valid_uuid';
    const ANY_VALID_URL = 'https://valid.url'
    const ANY_GH_USERNAME = 'any_username';
    const ANY_SLACK_ID = 12453;
    const candidate = new Candidate(
        new GithubUser(ANY_GH_USERNAME),
        new URL(ANY_VALID_URL)
    );
    const reviewersRepository = new InMemoryReviewerRepository();
    const candidateChallengeRepository = new InMemoryCandidateChallengeRepository();
    const challengeRepository = new InMemoryChallengeRepository();
    const githubClient = new SandboxedGithubClient();
    let reviewer: Reviewer, challenge: Challenge = null;

    beforeAll(async () => {
        const createReviewerService = new CreateReviewer(reviewersRepository);
        reviewer = await createReviewerService.run(ANY_GH_USERNAME, ANY_SLACK_ID);
    
        const createChallengeService = new CreateChallenge(challengeRepository);
        challenge = await createChallengeService.run(ANY_VALID_URL);
    });


    it('can create a candidateChallenge', async () => {
        const service = new CreateCandidateChallenge(
            candidateChallengeRepository,
            reviewersRepository,
            challengeRepository,
            githubClient
        );

        const createdCandidateChallenge = await service.run(ANY_VALID_URL, [ reviewer.getId() ], candidate, challenge.getId());

        expect(createdCandidateChallenge.getId()).not.toBe(null);
        expect(createdCandidateChallenge.getUrl()).toEqual(new URL(ANY_VALID_URL));
    });

    it('returns a rejected promise if URL is invalid', async () => {
        const ANY_INVALID_URL = 'httpsvalid.url'
        const service = new CreateCandidateChallenge(
            new InMemoryCandidateChallengeRepository(),
            new InMemoryReviewerRepository(),
            new InMemoryChallengeRepository(),
            new SandboxedGithubClient()
        );

        expect(service.run(ANY_INVALID_URL, [ ANY_ID ], candidate, ANY_ID )).rejects.toBeInstanceOf(CreateCandidateChallengeError);
    });

    it('returns a rejected promise if there is challenge is not found in the store', async () => {
        const service = new CreateCandidateChallenge(
            new InMemoryCandidateChallengeRepository(),
            new InMemoryReviewerRepository(),
            new InMemoryChallengeRepository(),
            new SandboxedGithubClient(),
        );

        expect(service.run(ANY_VALID_URL, [ ANY_ID ], candidate, ANY_ID )).rejects.toEqual(new CreateCandidateChallengeError('Challenge with id: any_valid_uuid not found'));
    });

    it('returns a rejected promise if there is an error saving in the repository', async () => {
        const ANY_ERROR_MESSAGE = 'any error message';

        const candidateChallengeRepository = new InMemoryCandidateChallengeRepository();
        candidateChallengeRepository.save = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));

        // saving a new challenge in the ChallengeRepository so it is found
        const challengeRepository = new InMemoryChallengeRepository();
        const challenge = Challenge.create(new URL(ANY_VALID_URL));
        challengeRepository.save(challenge);
        

        const service = new CreateCandidateChallenge(
            candidateChallengeRepository,
            new InMemoryReviewerRepository(),
            challengeRepository,
            new SandboxedGithubClient(),
        );

        expect(service.run(ANY_VALID_URL, [ ANY_ID ], candidate, challenge.getId() )).rejects.toEqual(new CreateCandidateChallengeError(ANY_ERROR_MESSAGE));
    });
});

