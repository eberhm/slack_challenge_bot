import { CreateChallenge } from '../../domain/Services/CreateChallenge';
import { GithubClient } from '../../Infrastructure/GithubClient';
import { ChallengeRepository } from '../../Infrastructure/ChallengeRepository';
import { Challenge } from 'src/domain/Entities/Challenge';

export type CreateChallengeUseCaseOptions = {
  challengeName: string;
  chanllengeUrl: string;
};

export class CreateChallengeUseCaseError extends Error {};

export class CreateChallengeUseCase {
  private logger: any;

  constructor(logger) {
    this.logger = logger;
  }

  async run({ challengeName, chanllengeUrl }: CreateChallengeUseCaseOptions): Promise<Challenge> {
    try {
      const service = new CreateChallenge(
        new ChallengeRepository(),
        new GithubClient()
      );
  
      const challenge = await service.run(challengeName, chanllengeUrl);

      this.logger.info(`Challenge ${chanllengeUrl} created successfully`);

      return challenge;
    } catch(e) {
      throw new CreateChallengeUseCaseError(`Error creating challenge ${chanllengeUrl}: ${e.message}`);
    }
  }
}