import { Challenge } from '../Entities/Challenge';
import { ChallengeRepository } from '../Interfaces/ChallengeRepository';
import { GithubClientInterface } from '../Interfaces/GithubClientInterface';

export class CreateChallengeError extends Error {}

export class CreateChallenge {
    private challengeRepository: ChallengeRepository;
    private githubClient: GithubClientInterface;

    public constructor(challengeRepository: ChallengeRepository, githubClient: GithubClientInterface) {
      this.challengeRepository = challengeRepository;
      this.githubClient = githubClient;
    }

    public async run(challengeName:string, chanllengeUrl: string): Promise<Challenge> {
      try {
        const url = new URL(chanllengeUrl);
        if (!await this.githubClient.githubRepositoryExists(url)) {
            throw new CreateChallengeError(`${chanllengeUrl} is not a valid Github Repository URL`);
        }

        const challenge = Challenge.create(challengeName, url);

        return await this.challengeRepository.save(challenge);
      } catch (e) {
        throw new CreateChallengeError(e.message);
      }
    }
}
