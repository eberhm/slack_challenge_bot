import { Challenge } from "../Entities/Challenge";
import ChallengeRepository from "../Interfaces/ChallengeRepository";

export class CreateChallengeCommand {
    public chanllengeUrl: string;
}

export class CreateChallenge {
    private challengeRepository: ChallengeRepository;

    public constructor(challengeRepository: ChallengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    public run(command: CreateChallengeCommand) {
        const challenge = new Challenge(
            null,
            new URL(command.chanllengeUrl)
        );

        return this.challengeRepository.create(challenge);
    }
}
