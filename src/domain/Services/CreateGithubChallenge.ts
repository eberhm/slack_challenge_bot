import { Challenge } from '../Entities/Challenge';
import { GithubClientInterface } from '../Interfaces/GithubClientInterface';
import { Candidate } from '../ValueObjects/Candidate';
import { GithubCodeChallenge } from '../ValueObjects/GithubCodeChallenge';

export class CreateGithubChallengeError extends Error {};

export class CreateGithubChallenge {
    private client: GithubClientInterface;

    constructor(githubClient: GithubClientInterface) {
        this.client = githubClient;
    }

    async run(challenge: Challenge, candidate: Candidate): Promise<GithubCodeChallenge> {
        try {
            const urlCodeChallengeRepo = await this.client.createChallengeForCandidate(challenge, candidate);
            return new GithubCodeChallenge(urlCodeChallengeRepo);
        } catch (e) {
            throw new CreateGithubChallengeError(e.message);
        }
    }
}