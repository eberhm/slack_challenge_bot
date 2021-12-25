import { CreateChallenge } from '../../domain/Services/CreateChallenge';
import { GithubClient } from '../../Infrastructure/GithubClient';
import { ChallengeRepository } from '../../Infrastructure/ChallengeRepository';
import { Challenge } from 'src/domain/Entities/Challenge';
import { UseCaseLogger } from './Logger';

export type CreateChallengeUseCaseOptions = {
  challengeName: string;
  chanllengeUrl: string;
};

export class CreateChallengeUseCaseError extends Error {};

export class CreateChallengeUseCase {
  private logger: UseCaseLogger;
  private createChallengeService: CreateChallenge;

  constructor(logger: UseCaseLogger, createChallengeService: CreateChallenge) {
    this.logger = logger || console;
    this.createChallengeService = createChallengeService;
  }

  static create(logger: UseCaseLogger) {
    return new this(logger,
      new CreateChallenge(
        new ChallengeRepository(),
        new GithubClient()
      )
    );
  }

  async run({ challengeName, chanllengeUrl }: CreateChallengeUseCaseOptions): Promise<Challenge> {
    try {
      const challenge = await this.createChallengeService.run(challengeName, chanllengeUrl);

      this.logger.info(`Challenge ${chanllengeUrl} created successfully`);

      return challenge;
    } catch(e) {
      throw new CreateChallengeUseCaseError(`Error creating challenge ${chanllengeUrl}: ${e.message}`);
    }
  }
}