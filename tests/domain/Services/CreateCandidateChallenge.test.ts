import 'jest';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { CandidateChallengeRepository } from '../../../src/domain/Interfaces/CandidateChallengeRepository';
import { ChallengeRepository } from '../../../src/domain/Interfaces/ChallengeRepository';
import { GithubClientInterface } from '../../../src/domain/Interfaces/GithubClientInterface';
import { ReviewerRepository } from '../../../src/domain/Interfaces/ReviewerRepository';
import { CreateCandidateChallenge, CreateCandidateChallengeError } from '../../../src/domain/Services/CreateCandidateChallenge';
import { CreateChallenge } from '../../../src/domain/Services/CreateChallenge';
import { CreateGithubChallenge } from '../../../src/domain/Services/CreateGithubChallenge';
import { CreateReviewer } from '../../../src/domain/Services/CreateReviewer';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { InMemoryCandidateChallengeRepository } from '../../Infrastructure/Repositories/InMemoryCandidateChallengeRepository';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';
import { InMemoryReviewerRepository } from '../../Infrastructure/Repositories/InMemoryReviewerRepository';
import { SandboxedGithubClient } from '../../Infrastructure/Repositories/SandboxedGithubClient';

describe('CreateCandidateChallenge Service creates a challenge and returns it newly inserted in the DB', () => {

    const ANY_ID = 'any_valid_uuid';
    const ANY_VALID_URL = 'https://valid.url'
    const ANY_VALID_CHALLENGE_NAME = 'any_name'
    const ANY_GH_USERNAME = 'any_username';
    const ANY_SLACK_ID = 'any_slack_id';
    const ANY_VALID_CANDIDATE = Candidate.create(ANY_GH_USERNAME, new URL(ANY_VALID_URL));

    let reviewersRepository: ReviewerRepository,
        candidateChallengeRepository: CandidateChallengeRepository,
        challengeRepository: ChallengeRepository,
        githubClient: GithubClientInterface,
        createGithubChallengeService: CreateGithubChallenge,
        service: CreateCandidateChallenge,
        reviewer: Reviewer,
        challenge: Challenge
    ;

    beforeEach(setUp)

    it.only('can create a candidateChallenge', async () => {
        const createdCandidateChallenge = await service.run(ANY_VALID_URL, [ reviewer.getId() ], ANY_VALID_CANDIDATE, challenge.getId());

        expect(createdCandidateChallenge.getId()).not.toBe(null);
        expect(createdCandidateChallenge.getUrl()).toEqual(new URL(ANY_VALID_URL));
    });

    it('returns a rejected promise if URL is invalid', async () => {
        const ANY_INVALID_URL = 'httpsvalid.url'

        expect(service.run(ANY_INVALID_URL, [ ANY_ID ], ANY_VALID_CANDIDATE, ANY_ID )).rejects.toBeInstanceOf(CreateCandidateChallengeError);
    });

    it('returns a rejected promise if there is challenge is not found in the store', async () => {

        expect(service.run(ANY_VALID_URL, [ ANY_ID ], ANY_VALID_CANDIDATE, ANY_ID )).rejects.toEqual(new CreateCandidateChallengeError('Challenge with id: any_valid_uuid not found'));
    });

    it('returns a rejected promise if there is an error saving in the repository', async () => {
        const ANY_ERROR_MESSAGE = 'any error message';

        candidateChallengeRepository.save = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));

        // saving a new challenge in the ChallengeRepository so it is found
        const challenge = Challenge.create(ANY_VALID_CHALLENGE_NAME, new URL(ANY_VALID_URL));
        challengeRepository.save(challenge);

        expect(service.run(ANY_VALID_URL, [ ANY_ID ], ANY_VALID_CANDIDATE, challenge.getId() )).rejects.toEqual(new CreateCandidateChallengeError(ANY_ERROR_MESSAGE));
    });

    async function setUp() {
        reviewersRepository = new InMemoryReviewerRepository();
        candidateChallengeRepository = new InMemoryCandidateChallengeRepository();
        challengeRepository = new InMemoryChallengeRepository();
        githubClient = new SandboxedGithubClient();
        createGithubChallengeService = new CreateGithubChallenge(githubClient);

        const createReviewerService = new CreateReviewer(reviewersRepository);
        reviewer = await createReviewerService.run(ANY_GH_USERNAME, ANY_SLACK_ID);
    
        const createChallengeService = new CreateChallenge(challengeRepository, githubClient);
        challenge = await createChallengeService.run(ANY_VALID_CHALLENGE_NAME, ANY_VALID_URL);

        service = new CreateCandidateChallenge(
            candidateChallengeRepository,
            reviewersRepository,
            challengeRepository,
            createGithubChallengeService,
            githubClient
        );
    }
});

