import { Challenge } from '../Entities/Challenge';
import { ChallengeRepository } from '../Interfaces/ChallengeRepository';

export class CreateChallengeError extends Error {}

export class CreateChallenge {
    private challengeRepository: ChallengeRepository;

    public constructor(challengeRepository: ChallengeRepository) {
      this.challengeRepository = challengeRepository;
    }

    public async run(chanllengeUrl: string): Promise<Challenge> {
      try {
        const challenge = Challenge.create(
          new URL(chanllengeUrl),
        );

        return await this.challengeRepository.save(challenge);
      } catch (e) {
        throw new CreateChallengeError(e.message);
      }
    }
}
