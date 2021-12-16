import { Challenge } from '../domain/Entities/Challenge';
import { Reviewer } from '../domain/Entities/Reviewer';
import { GithubClientInterface } from '../domain/Interfaces/GithubClientInterface';
import { Candidate } from '../domain/ValueObjects/Candidate';
import { GithubCodeChallenge } from '../domain/ValueObjects/GithubCodeChallenge';
import { Octokit } from 'octokit';

export class GithubClientError extends Error {};

const octokit = new Octokit({ auth: process.env.SLACK_CC_GITHUB_TOKEN });
export class GithubClient implements GithubClientInterface {

    async createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<URL> {
        throw new Error('not implemented');
    }

    async githubRepositoryExists(url: URL): Promise<boolean> {
        try {
            const response = await octokit.rest.repos.get(this.parseOwnerAndRepo(url));
    
            return response.status === 200;
        } catch(e) {
            throw new GithubClientError(e.message);
        }
    }

    async addReviewersToCodeChallenge(ghCodeChallenge: GithubCodeChallenge, reviewers: Reviewer[]): Promise<GithubCodeChallenge> {
        throw new Error('not implemented');
    }

    private parseOwnerAndRepo(url: URL): { owner: string, repo: string } {
        const [ owner, repo ] =  url.pathname.substring(1).split('/');
        return { owner , repo };
    }
}