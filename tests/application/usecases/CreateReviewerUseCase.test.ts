import 'jest';
import { CreateReviewerUseCase, CreateReviewerUseCaseError, CreateReviewerUseCaseOptions } from '../../../src/application/usecases/CreateReviewerUseCase';
import { VoidLogger } from '../../../src/application/usecases/Logger';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { CreateReviewer, CreateReviewerError } from '../../../src/domain/Services/CreateReviewer';
import { InMemoryReviewerRepository } from '../../Infrastructure/adapters/InMemoryReviewerRepository';

describe('CreateReviewerUseCase', () => {
    const ANY_ID = "anystring";
    const ANY_VALID_GH_USERNAME = 'anothervalid.user';
    let reviewerService: CreateReviewer;

    beforeEach(() => {
      reviewerService = new CreateReviewer(
        new InMemoryReviewerRepository()
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('creates a Reviewer object', async () => {
      
      const useCase = new CreateReviewerUseCase(
        new VoidLogger(), 
        new CreateReviewer(
          new InMemoryReviewerRepository()
          )
        );
      
      const usecaseOptions: CreateReviewerUseCaseOptions = {
        slackId: ANY_ID,
        githubUsername: ANY_VALID_GH_USERNAME
      };

      const reviewer: Reviewer = await useCase.run(usecaseOptions);

      expect(reviewer.getGithubUser().getUsername()).toBe(ANY_VALID_GH_USERNAME);
      expect(reviewer.getSlackUser().getUserId()).toBe(ANY_ID);
    });

    it('fails if the service fails', () => {
      const ANY_ERROR_MESSAGE = 'any error message';
      const useCase = new CreateReviewerUseCase(
        new VoidLogger(), 
        reviewerService
        );
      
      reviewerService.run = jest.fn().mockRejectedValue(new CreateReviewerError(ANY_ERROR_MESSAGE));

      const usecaseOptions: CreateReviewerUseCaseOptions = {
        slackId: ANY_ID,
        githubUsername: ANY_VALID_GH_USERNAME
      };

      expect(useCase.run(usecaseOptions)).rejects.toBeInstanceOf(CreateReviewerUseCaseError);
    });
});