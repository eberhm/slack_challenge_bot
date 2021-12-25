import 'jest';
import { CreateChallengeUseCase, CreateChallengeUseCaseError, CreateChallengeUseCaseOptions } from '../../../src/application/usecases/CreateChallengeUseCase';
import { VoidLogger } from '../../../src/application/usecases/Logger';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { CreateChallenge, CreateChallengeError } from '../../../src/domain/Services/CreateChallenge';
import { InMemoryChallengeRepository } from '../../Infrastructure/Repositories/InMemoryChallengeRepository';
import { SandboxedGithubClient } from '../../Infrastructure/Repositories/SandboxedGithubClient';

describe('CreateChallengeUseCase', () => {
    const ANY_NAME = "any name";
    const ANY_URL = 'http://valid.url';
    let challengeService: CreateChallenge;

    beforeEach(() => {
      challengeService = new CreateChallenge(
        new InMemoryChallengeRepository(),
        new SandboxedGithubClient()
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('creates a Challenge object', async () => {
      
      const useCase = new CreateChallengeUseCase(
        new VoidLogger(), 
        challengeService
        );
      
      const usecaseOptions: CreateChallengeUseCaseOptions = {
        challengeName: ANY_NAME,
        chanllengeUrl: ANY_URL
      };

      const challenge: Challenge = await useCase.run(usecaseOptions);

      expect(challenge.getName()).toBe(ANY_NAME);
      expect(challenge.getUrl()).toEqual(new URL(ANY_URL));
    });

    it('fails if the service fails', () => {
      const ANY_ERROR_MESSAGE = 'any error message';
      const useCase = new CreateChallengeUseCase(
        new VoidLogger(), 
        challengeService
        );
      
      challengeService.run = jest.fn().mockRejectedValue(new CreateChallengeError(ANY_ERROR_MESSAGE));

      const usecaseOptions: CreateChallengeUseCaseOptions = {
        challengeName: ANY_NAME,
        chanllengeUrl: ANY_URL
      };

      expect(useCase.run(usecaseOptions)).rejects.toBeInstanceOf(CreateChallengeUseCaseError);
    });
});