import 'jest';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { CreateCandidateChallenge, CreateCandidateChallengeError } from '../../../src/domain/Services/CreateCandidateChallenge';
import { CreateChallenge } from '../../../src/domain/Services/CreateChallenge';
import { CreateReviewer } from '../../../src/domain/Services/CreateReviewer';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { InMemoryCandidateChallengeRepository } from '../../Infrastructure/Repositories/InMemoryCandidateChallengeRepository';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';
import { InMemoryReviewerRepository } from '../../Infrastructure/Repositories/InMemoryReviewerRepository';
import { SandboxedGithubClient } from '../../Infrastructure/Repositories/SandboxedGithubClient';

//TODO: refactor this test to reduce boilerplate and improve readibility
describe('CreateCandidateChallenge Service creates a challenge and returns it newly inserted in the DB', () => {

    const ANY_ID = 'any_valid_uuid';
    const ANY_VALID_URL = 'https://valid.url'
    const ANY_VALID_CHALLENGE_NAME = 'any_name'
    const ANY_GH_USERNAME = 'any_username';
    const ANY_SLACK_ID = 'any_slack_id';
    const ANY_VALID_CANDIDATE = new Candidate(
        new GithubUser(ANY_GH_USERNAME),
        new URL(ANY_VALID_URL)
    );

    const reviewersRepository = new InMemoryReviewerRepository();
    const candidateChallengeRepository = new InMemoryCandidateChallengeRepository();
    const challengeRepository = new InMemoryChallengeRepository();
    const githubClient = new SandboxedGithubClient();
    let reviewer: Reviewer, challenge: Challenge;

    beforeAll(async () => {
        const createReviewerService = new CreateReviewer(reviewersRepository);
        reviewer = await createReviewerService.run(ANY_GH_USERNAME, ANY_SLACK_ID);
    
        const createChallengeService = new CreateChallenge(challengeRepository, githubClient);
        challenge = await createChallengeService.run(ANY_VALID_CHALLENGE_NAME, ANY_VALID_URL);
    });


    it('can create a candidateChallenge', async () => {
        const service = new CreateCandidateChallenge(
            candidateChallengeRepository,
            githubClient
        );

        const createdCandidateChallenge = await service.run(
            ANY_VALID_CANDIDATE,
            challenge,
            [ reviewer ]
        );

        expect(createdCandidateChallenge.getId()).not.toBe(null);
        expect(createdCandidateChallenge.getUrl()).not.toBe(null);
        expect(createdCandidateChallenge.getCandidate().getGithubUser()).toEqual(new GithubUser(ANY_GH_USERNAME));
    });

    //this tests belongs to the value object (GithubUser)
    it.skip('returns a rejected promise if URL does not belongs to a github user', async () => {
        const NON_EXISTING_GH_USER = 'non_existing_github_user'
        const service = new CreateCandidateChallenge(
            candidateChallengeRepository,
            githubClient
        );

        expect(
            service.run(
                new Candidate(
                    new GithubUser(NON_EXISTING_GH_USER),
                    new URL(ANY_VALID_URL)
                ),
                challenge,
                [ reviewer ],
            )
        ).rejects.toBeInstanceOf(CreateCandidateChallengeError);
    });

    //this behaviour should now be moved to application use case level
    it.skip('returns a rejected promise if there is challenge is not found in the store', async () => {
        const service = new CreateCandidateChallenge(
            candidateChallengeRepository,
            githubClient
        );
        const unsavedChallenge = Challenge.create(ANY_VALID_CHALLENGE_NAME, new URL(ANY_VALID_URL));


        expect(
            service.run(
                ANY_VALID_CANDIDATE,
                unsavedChallenge,
                [ reviewer ]
            )
        ).rejects.toEqual(new CreateCandidateChallengeError(`Challenge with id: ${unsavedChallenge.getId()} not found`));
    });

    it('returns a rejected promise if there is an error saving in the repository', async () => {
        const ANY_ERROR_MESSAGE = 'any error message';

        const candidateChallengeRepository = new InMemoryCandidateChallengeRepository();
        candidateChallengeRepository.save = jest.fn().mockRejectedValue(new Error(ANY_ERROR_MESSAGE));

        // saving a new challenge in the ChallengeRepository so it is found
        const challengeRepository = new InMemoryChallengeRepository();
        const challenge = Challenge.create(ANY_VALID_CHALLENGE_NAME, new URL(ANY_VALID_URL));
        challengeRepository.save(challenge);

        const service = new CreateCandidateChallenge(
            candidateChallengeRepository,
            githubClient
        );

        expect(
            service.run(
                ANY_VALID_CANDIDATE,
                challenge,
                [ reviewer ]
            )
        ).rejects.toEqual(new CreateCandidateChallengeError(ANY_ERROR_MESSAGE));
    });
});

