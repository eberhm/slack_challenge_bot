import { Challenge } from '../domain/Entities/Challenge';
import { Reviewer } from '../domain/Entities/Reviewer';
import { GithubClient as GithubClientInterface } from '../domain/Interfaces/GithubClient';
import { Candidate } from '../domain/ValueObjects/Candidate';
import { GithubCodeChallenge } from '../domain/ValueObjects/GithubCodeChallenge';
import { Octokit } from 'octokit';

export class GithubClientError extends Error {};

const octokit = new Octokit({ auth: process.env.SLACK_CC_GITHUB_TOKEN });
export class GithubClient implements GithubClientInterface {
    async createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<GithubCodeChallenge> {
        let urlRepository;
        try {
            urlRepository = `https://githubInstanceUrl.my/myOrg/test_${challenge.getId()}_${candidate.getGithubUser().getUsername()}`;
        } catch (e) {
            return Promise.reject(new Error(`Error creating challenge on GH: ${e.message}`));
        }

        return new GithubCodeChallenge(new URL(urlRepository));
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