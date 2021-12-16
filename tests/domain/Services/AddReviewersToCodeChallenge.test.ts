import 'jest';
import { CandidateChallenge } from '../../../src/domain/Entities/CandidateChallenge';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { CandidateChallengeRepository } from '../../../src/domain/Interfaces/CandidateChallengeRepository';
import { ChallengeRepository } from '../../../src/domain/Interfaces/ChallengeRepository';
import { GithubClientInterface } from '../../../src/domain/Interfaces/GithubClientInterface';
import { ReviewerRepository } from '../../../src/domain/Interfaces/ReviewerRepository';
import { AddReviewersToCodeChallenge, AddReviewersToCodeChallengeError } from '../../../src/domain/Services/AddReviewersToCodeChallenge';
import { CreateChallenge } from '../../../src/domain/Services/CreateChallenge';
import { CreateReviewer } from '../../../src/domain/Services/CreateReviewer';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { Identifier } from '../../../src/domain/ValueObjects/Identifier';
import { InMemoryCandidateChallengeRepository } from '../../Infrastructure/Repositories/InMemoryCandidateChallengeRepository';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';
import { InMemoryReviewerRepository } from '../../Infrastructure/Repositories/InMemoryReviewerRepository';
import { SandboxedGithubClient } from '../../Infrastructure/Repositories/SandboxedGithubClient';

describe('AddReviewersToCodeChallenge Service', () => {

    const ANY_VALID_URL = 'https://valid.url'
    const ANY_VALID_CHALLENGE_NAME = 'any_name'
    const ANY_GH_USERNAME = 'any_username';
    const ANY_SLACK_ID = 'any_slack_id';

    let reviewersRepository: ReviewerRepository,
        candidateChallengeRepository: CandidateChallengeRepository,
        challengeRepository: ChallengeRepository,
        githubClient: GithubClientInterface,
        service: AddReviewersToCodeChallenge,
        candidateChallenge: CandidateChallenge,
        challenge: Challenge,
        reviewerIds: Identifier[]
    ;

    beforeEach(setUp)

    it('can add reviewers to an existing GHCodeChallenge', async () => {
        //WARN mutable state
        //TODO: make immutable implementation
        await service.run(candidateChallenge, reviewerIds);

        expect(candidateChallenge.getReviewerIds()).toEqual(reviewerIds);
    });

    it('fails when the githubClient fails', async () => {
        const CLIENT_ERROR_MESSAGE = 'Error in GHClient';
        githubClient.addReviewersToCodeChallenge = jest.fn().mockRejectedValue(new Error(CLIENT_ERROR_MESSAGE));

        expect(service.run(candidateChallenge, reviewerIds)).rejects.toEqual(new AddReviewersToCodeChallengeError(CLIENT_ERROR_MESSAGE));
    });

    it('returns a rejected promise if there is an error saving in the repository', async () => {
        const REPO_FAILURE_MESSAGE = 'error saving into repository';

        candidateChallengeRepository.addReviewers = jest.fn().mockRejectedValue(new Error(REPO_FAILURE_MESSAGE));

        expect(service.run(candidateChallenge, reviewerIds)).rejects.toEqual(new AddReviewersToCodeChallengeError(REPO_FAILURE_MESSAGE));
    });

    async function setUp() {
        reviewersRepository = new InMemoryReviewerRepository();
        candidateChallengeRepository = new InMemoryCandidateChallengeRepository();
        challengeRepository = new InMemoryChallengeRepository();
        githubClient = new SandboxedGithubClient();

        const createReviewerService = new CreateReviewer(reviewersRepository);
        const reviewer = await createReviewerService.run(ANY_GH_USERNAME, ANY_SLACK_ID);
        reviewerIds = [reviewer.getId()];
    
        const createChallengeService = new CreateChallenge(challengeRepository, githubClient);
        challenge = await createChallengeService.run(ANY_VALID_CHALLENGE_NAME, ANY_VALID_URL);

        candidateChallenge = CandidateChallenge.create(
            new URL(ANY_VALID_URL),
            Candidate.create(ANY_GH_USERNAME, new URL(ANY_VALID_URL)),
            [],
            challenge.getId()
        );

        service = new AddReviewersToCodeChallenge(
            candidateChallengeRepository,
            reviewersRepository,
            githubClient
        );
    }
});

