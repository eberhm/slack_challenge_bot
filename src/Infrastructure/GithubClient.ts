import { Challenge } from '../domain/Entities/Challenge';
import { Reviewer } from '../domain/Entities/Reviewer';
import { GithubClientInterface } from '../domain/Interfaces/GithubClientInterface';
import { Candidate } from '../domain/ValueObjects/Candidate';
import { Octokit } from 'octokit';

export class GithubClientError extends Error {};

const octokit = new Octokit({ auth: process.env.SLACK_CC_GITHUB_TOKEN });
export class GithubClient implements GithubClientInterface {

    async createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<URL> {
        try {
            const { owner, repo } = this.parseOwnerAndRepo(challenge.getUrl()); 
            const candidateGithubUsername = candidate.getGithubUser().getUsername();
            const repoName = `${repo}_${candidateGithubUsername}`;

            const response = await octokit.rest.repos.createUsingTemplate({
                template_owner: owner, // eslint-disable-line camelcase
                template_repo: repo, // eslint-disable-line camelcase
                owner,
                name: repoName,
                private: true
            });

            if (!this.requestWasSuccess(response)) {
                throw new Error(`GH Request error. Status code: ${response.status}`);
            }

            await octokit.rest.repos.addCollaborator({
                owner,
                repo: repoName,
                username: candidate.getGithubUser().getUsername()
            });

            return new URL(response.data.html_url);
        } catch (e) {
            throw new GithubClientError(`Error while creating candidate repository. Error: ${e.message}`);
        }
    }

    private requestWasSuccess(response):boolean {
        return !!(response.status.toString()[0] == '2');
    }

    async githubRepositoryExists(url: URL): Promise<boolean> {
        try {
            const response = await octokit.rest.repos.get(this.parseOwnerAndRepo(url));
    
            return this.requestWasSuccess(response);
        } catch(e) {
            throw new GithubClientError(e.message);
        }
    }

    async addReviewersToCodeChallenge(candidateChallengeUrl: URL, reviewers: Reviewer[]): Promise<void> {
        try {
            const { owner, repo } = this.parseOwnerAndRepo(candidateChallengeUrl);
            const result = await Promise.allSettled(
                reviewers.map((reviewer) => {
                    return octokit.rest.repos.addCollaborator({
                        owner,
                        repo,
                        username: reviewer.getGithubUser().getUsername()
                    });
                })
            );

            /** TODO: how do we control this error? */
            /*
            const allRequestOK = result.reduce(
                (status, addOwnerReqResult) => status && this.requestWasSuccess(addOwnerReqResult), 
                true);

            if (!allRequestOK) {
                console.warn(`Not all collaborators where added`)
            }
            */
        } catch (e) {
               throw new GithubClientError(`Error while adding collaborators to repo: ${e.message}`);
        }
    }

    private parseOwnerAndRepo(url: URL): { owner: string, repo: string } {
        const [ owner, repo ] =  url.pathname.substring(1).split('/');
        return { owner , repo };
    }
}