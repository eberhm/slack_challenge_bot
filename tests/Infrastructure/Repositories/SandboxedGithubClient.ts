import { Challenge } from "../../../src/domain/Entities/Challenge";
import { Reviewer } from "../../../src/domain/Entities/Reviewer";
import { GithubClientInterface } from "../../../src/domain/Interfaces/GithubClientInterface";
import { Candidate } from "../../../src/domain/ValueObjects/Candidate";
import { GithubCodeChallenge } from "../../../src/domain/ValueObjects/GithubCodeChallenge";

export class SandboxedGithubClient implements GithubClientInterface {
    async createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<URL> {
        let urlRepository :string;
        try {
            urlRepository = `https://githubInstanceUrl.my/myOrg/test_${challenge.getId()}_${candidate.getGithubUser().getUsername()}`;
        } catch (e) {
            return Promise.reject(new Error(`Error creating challenge on GH: ${e.message}`));
        }

        return new URL(urlRepository);
    }

    async githubRepositoryExists(url: URL): Promise<boolean> {
        return true;
    }

    async addReviewersToCodeChallenge(ghCodeChallenge: GithubCodeChallenge, reviewers: Reviewer[]): Promise<GithubCodeChallenge> {
        return ghCodeChallenge;
    }
}