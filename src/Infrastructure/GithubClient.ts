import { Challenge } from '../domain/Entities/Challenge';
import { Reviewer } from '../domain/Entities/Reviewer';
import { GithubClient } from '../domain/Interfaces/GithubClient';
import { Candidate } from '../domain/ValueObjects/Candidate';
import { GithubCodeChallenge } from '../domain/ValueObjects/GithubCodeChallenge';


export class RestGithubClient implements GithubClient {
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