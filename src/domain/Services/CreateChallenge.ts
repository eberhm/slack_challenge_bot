import { Challenge } from "../Entities/Challenge";
import ChallengeRepository from "../Interfaces/ChallengeRepository";

export class CreateChallengeError extends Error {};

export class CreateChallenge {
    private challengeRepository: ChallengeRepository;

    public constructor(challengeRepository: ChallengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    public async run(chanllengeUrl: string) {
        try {
            const challenge = new Challenge(
                null,
                new URL(chanllengeUrl)
            );

            return await this.challengeRepository.create(challenge);
        } catch (e) {
            throw new CreateChallengeError(e.message);
        }
    }
}
