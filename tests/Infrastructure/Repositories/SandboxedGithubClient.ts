import { CandidateChallenge } from "../../../src/domain/Entities/CandidateChallenge";
import { Challenge } from "../../../src/domain/Entities/Challenge";
import { Reviewer } from "../../../src/domain/Entities/Reviewer";
import { GithubClientInterface } from "../../../src/domain/Interfaces/GithubClientInterface";
import { Candidate } from "../../../src/domain/ValueObjects/Candidate";
import { GithubUser } from "../../../src/domain/ValueObjects/GithubUser";

export const CHALLENGE_FOR_CANDIDATE_REPO_URL = 'http://www.ANY_REPOSITORY_URL.com';
export class SandboxedGithubClient implements GithubClientInterface {
    async addCollaboratorToCandidateChallenge(candidateChallenge: CandidateChallenge, collaborator: GithubUser): Promise<URL> {
        let urlRepository :string;
        try {
            urlRepository = CHALLENGE_FOR_CANDIDATE_REPO_URL;
        } catch (e) {
            return Promise.reject(new Error(`Error adding collaborator to challenge on GH: ${e.message}`));
        }

        return new URL(urlRepository);
    }
    async createIssueForCandidateChallenge(candidateChallenge: CandidateChallenge, challenge: Challenge): Promise<URL> {
        let urlRepository :string;
        try {
            urlRepository = CHALLENGE_FOR_CANDIDATE_REPO_URL;
        } catch (e) {
            return Promise.reject(new Error(`Error creating issue for candidate challenge on GH: ${e.message}`));
        }

        return new URL(urlRepository);
    }
    
    async createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<URL> {
        let urlRepository :string;
        try {
            urlRepository = CHALLENGE_FOR_CANDIDATE_REPO_URL;
        } catch (e) {
            return Promise.reject(new Error(`Error creating challenge on GH: ${e.message}`));
        }

        return new URL(urlRepository);
    }

    async githubRepositoryExists(url: URL): Promise<boolean> {
        return true;
    }

    async addReviewersToCodeChallenge(candidateChallengeUrl: URL, reviewers: Reviewer[]): Promise<void> {
        return;
    }
    
}