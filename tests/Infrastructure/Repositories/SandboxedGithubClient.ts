import { Challenge } from "../../../src/domain/Entities/Challenge";
import { Reviewer } from "../../../src/domain/Entities/Reviewer";
import { GithubClient } from "../../../src/domain/Interfaces/GithubClient";
import { Candidate } from "../../../src/domain/ValueObjects/Candidate";
import { GithubCodeChallenge } from "../../../src/domain/ValueObjects/GithubCodeChallenge";

export class SandboxedGithubClient implements GithubClient {
    async createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<GithubCodeChallenge> {
        let urlRepository;
        try {
            urlRepository = `https://githubInstanceUrl.my/myOrg/test_${challenge.getId()}_${candidate.getGithubUser().getUsername()}`;
        } catch (e) {
            return Promise.reject(new Error(`Error creating challenge on GH: ${e.message}`));
        }

        return new GithubCodeChallenge(new URL(urlRepository));
    }

    addReviewersToCodeChallenge(ghCodeChallenge: GithubCodeChallenge, reviewers: Reviewer[]): void {
        return;
    }
}