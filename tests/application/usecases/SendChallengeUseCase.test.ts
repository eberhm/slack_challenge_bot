import 'jest';
import { SendChallengeUseCase, SendChallengeUseCaseError, SendChallengeUseCaseOptions } from '../../../src/application/usecases/SendChallengeUseCase';
import { VoidLogger } from '../../../src/application/usecases/Logger';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { InMemoryReviewerRepository } from '../../Infrastructure/Repositories/InMemoryReviewerRepository';
import { ChallengeRepository } from '../../../src/domain/Interfaces/ChallengeRepository';
import { CreateCandidateChallenge } from '../../../src/domain/Services/CreateCandidateChallenge';
import { AddReviewersToCodeChallenge } from '../../../src/domain/Services/AddReviewersToCodeChallenge';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';
import { InMemoryCandidateChallengeRepository } from '../../Infrastructure/Repositories/InMemoryCandidateChallengeRepository';
import { CHALLENGE_FOR_CANDIDATE_REPO_URL, SandboxedGithubClient } from '../../Infrastructure/Repositories/SandboxedGithubClient';
import { CandidateChallenge } from '../../../src/domain/Entities/CandidateChallenge';
import { ReviewerRepository } from '../../../src/domain/Interfaces/ReviewerRepository';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { SlackUser } from '../../../src/domain/ValueObjects/SlackUser';

describe('SendChallengeUseCase', () => {
    const ANY_VALID_NAME = 'Any Name';
    const ANY_VALID_GH_USERNAME = 'anothervalid.user';
    const ANY_VALID_URL = 'http://valid.url';
    const ANY_VALID_CHALLENGE_NAME = 'any challenge name';
    const ANY_SLACK_ID = 'any_slack_id1';
    const ANY_SLACK_ID_2 = 'any_slack_id2';

    let challengeRepository: ChallengeRepository;
    let createCandidateChallengeService: CreateCandidateChallenge;
    let addReviewersToChallengeService: AddReviewersToCodeChallenge;
    let reviewerRepository: ReviewerRepository;
    let useCase: SendChallengeUseCase;

    beforeEach(() => {
      const githubClient = new SandboxedGithubClient();
      reviewerRepository = new InMemoryReviewerRepository();
      challengeRepository = new InMemoryChallengeRepository();
      createCandidateChallengeService = new CreateCandidateChallenge(
        new InMemoryCandidateChallengeRepository(),
        challengeRepository,
        githubClient
      );
      addReviewersToChallengeService = new AddReviewersToCodeChallenge(
        new InMemoryCandidateChallengeRepository(),
        reviewerRepository,
        githubClient
      );

      useCase = new SendChallengeUseCase(
        new VoidLogger(),
        challengeRepository,
        createCandidateChallengeService,
        addReviewersToChallengeService
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('creates a CandidateChallenge object with no reviewers', async () => {
      // preparing state
      const challenge = Challenge.create(ANY_VALID_CHALLENGE_NAME, new URL(ANY_VALID_URL))
      await challengeRepository.save(challenge);

      const usecaseOptions: SendChallengeUseCaseOptions = {
        candidateName: ANY_VALID_NAME,
        challengeName: ANY_VALID_CHALLENGE_NAME,
        githubUser: ANY_VALID_GH_USERNAME,
        resumeUrl: ANY_VALID_URL
      };
      const candidateChallenge: CandidateChallenge = await useCase.run(usecaseOptions);

      expect(candidateChallenge.getCandidate().getName()).toBe(ANY_VALID_NAME);
      expect(candidateChallenge.getCandidate().getGithubUser().getUsername()).toBe(ANY_VALID_GH_USERNAME);
      expect(candidateChallenge.getCandidate().getResumeUrl()).toEqual(new URL(ANY_VALID_URL));
      expect(candidateChallenge.getCandidateChallengeUrl()).toEqual(new URL(CHALLENGE_FOR_CANDIDATE_REPO_URL));
      expect(candidateChallenge.getChallengeId()).toBe(challenge.getId());
      expect(candidateChallenge.getReviewerIds()).toEqual([]);

    });

    it('creates a CandidateChallenge object with the reviewer passed', async () => {
      // preparing the state
      const challenge = Challenge.create(ANY_VALID_CHALLENGE_NAME, new URL(ANY_VALID_URL))
      await challengeRepository.save(challenge);

      const reviewer1 = Reviewer.create(
        new GithubUser(ANY_VALID_GH_USERNAME),
        new SlackUser(ANY_SLACK_ID)
      );
      await reviewerRepository.save(reviewer1);

      const usecaseOptions: SendChallengeUseCaseOptions = {
        candidateName: ANY_VALID_NAME,
        challengeName: ANY_VALID_CHALLENGE_NAME,
        githubUser: ANY_VALID_GH_USERNAME,
        resumeUrl: ANY_VALID_URL,
        reviewer1: ANY_SLACK_ID
      };
      const candidateChallenge: CandidateChallenge = await useCase.run(usecaseOptions);

      expect(candidateChallenge.getCandidate().getName()).toBe(ANY_VALID_NAME);
      expect(candidateChallenge.getCandidate().getGithubUser().getUsername()).toBe(ANY_VALID_GH_USERNAME);
      expect(candidateChallenge.getCandidate().getResumeUrl()).toEqual(new URL(ANY_VALID_URL));
      expect(candidateChallenge.getCandidateChallengeUrl()).toEqual(new URL(CHALLENGE_FOR_CANDIDATE_REPO_URL));
      expect(candidateChallenge.getChallengeId()).toBe(challenge.getId());
      expect(candidateChallenge.getReviewerIds()).toEqual([ reviewer1.getId() ]);

    });

    it('creates a CandidateChallenge object with the 2 reviewers passed', async () => {
      // preparing the state
      const challenge = Challenge.create(ANY_VALID_CHALLENGE_NAME, new URL(ANY_VALID_URL))
      await challengeRepository.save(challenge);

      const reviewer1 = Reviewer.create(
        new GithubUser(ANY_VALID_GH_USERNAME),
        new SlackUser(ANY_SLACK_ID)
      );
      await reviewerRepository.save(reviewer1);

      const reviewer2 = Reviewer.create(
        new GithubUser(ANY_VALID_GH_USERNAME),
        new SlackUser(ANY_SLACK_ID_2)
      );
      await reviewerRepository.save(reviewer2);

      const usecaseOptions: SendChallengeUseCaseOptions = {
        candidateName: ANY_VALID_NAME,
        challengeName: ANY_VALID_CHALLENGE_NAME,
        githubUser: ANY_VALID_GH_USERNAME,
        resumeUrl: ANY_VALID_URL,
        reviewer1: ANY_SLACK_ID,
        reviewer2: ANY_SLACK_ID_2
      };
      const candidateChallenge: CandidateChallenge = await useCase.run(usecaseOptions);

      expect(candidateChallenge.getCandidate().getName()).toBe(ANY_VALID_NAME);
      expect(candidateChallenge.getCandidate().getGithubUser().getUsername()).toBe(ANY_VALID_GH_USERNAME);
      expect(candidateChallenge.getCandidate().getResumeUrl()).toEqual(new URL(ANY_VALID_URL));
      expect(candidateChallenge.getCandidateChallengeUrl()).toEqual(new URL(CHALLENGE_FOR_CANDIDATE_REPO_URL));
      expect(candidateChallenge.getChallengeId()).toBe(challenge.getId());
      expect(candidateChallenge.getReviewerIds()).toEqual([ reviewer1.getId(), reviewer2.getId()]);

    });

    it('fails if the challenge is not in the repository', () => {

      const usecaseOptions: SendChallengeUseCaseOptions = {
        candidateName: ANY_VALID_NAME,
        challengeName: ANY_VALID_CHALLENGE_NAME,
        githubUser: ANY_VALID_GH_USERNAME,
        resumeUrl: ANY_VALID_URL
      };

      expect(useCase.run(usecaseOptions)).rejects.toBeInstanceOf(SendChallengeUseCaseError);
    });

    it('fails if the challenge is not in the repository', () => {

      const usecaseOptions: SendChallengeUseCaseOptions = {
        candidateName: ANY_VALID_NAME,
        challengeName: ANY_VALID_CHALLENGE_NAME,
        githubUser: ANY_VALID_GH_USERNAME,
        resumeUrl: ANY_VALID_URL
      };

      expect(useCase.run(usecaseOptions)).rejects.toBeInstanceOf(SendChallengeUseCaseError);
    });

    it('fails if the CreateCandidateChallenge Service fails to execute', async () => {
      // preparing the state
      const challenge = Challenge.create(ANY_VALID_CHALLENGE_NAME, new URL(ANY_VALID_URL))
      await challengeRepository.save(challenge);

      const usecaseOptions: SendChallengeUseCaseOptions = {
        candidateName: ANY_VALID_NAME,
        challengeName: ANY_VALID_CHALLENGE_NAME,
        githubUser: ANY_VALID_GH_USERNAME,
        resumeUrl: ANY_VALID_URL
      };

      createCandidateChallengeService.run = jest.fn().mockRejectedValue(new Error());

      expect(useCase.run(usecaseOptions)).rejects.toBeInstanceOf(SendChallengeUseCaseError);
    });

    it('fails if the AddReviewersToCodeChallenge Service fails to execute', async () => {
      // preparing the state
      const challenge = Challenge.create(ANY_VALID_CHALLENGE_NAME, new URL(ANY_VALID_URL))
      await challengeRepository.save(challenge);

      // reviewers are not required in the state as 
      // we're mocking the service that adds them
      // we only need to pass some IDs
      const usecaseOptions: SendChallengeUseCaseOptions = {
        candidateName: ANY_VALID_NAME,
        challengeName: ANY_VALID_CHALLENGE_NAME,
        githubUser: ANY_VALID_GH_USERNAME,
        resumeUrl: ANY_VALID_URL,
        reviewer1: ANY_SLACK_ID,
        reviewer2: ANY_SLACK_ID_2
      };

      addReviewersToChallengeService.run = jest.fn().mockRejectedValue(new Error());

      expect(useCase.run(usecaseOptions)).rejects.toBeInstanceOf(SendChallengeUseCaseError);
    });
});