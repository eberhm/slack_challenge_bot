import { Challenge } from '../../domain/Entities/Challenge';
import { GithubClientInterface } from '../../domain/Ports/GithubClientInterface';
import { Candidate } from '../../domain/ValueObjects/Candidate';
import { Octokit } from 'octokit';
import { CandidateChallenge } from '../../domain/Entities/CandidateChallenge';
import { GithubUser } from '../../domain/ValueObjects/GithubUser';

export class GithubClientError extends Error {};

const octokit = new Octokit({ auth: process.env.SLACK_CC_GITHUB_TOKEN });
export class GithubClient implements GithubClientInterface {

    async addCollaboratorToCandidateChallenge(candidateChallenge: CandidateChallenge, collaborator: GithubUser): Promise<URL> {
        try {
            const { owner, repo } = this.parseOwnerAndRepo(candidateChallenge.getCandidateChallengeUrl()); 

            const response = await octokit.rest.repos.addCollaborator({
                owner,
                repo,
                username: collaborator.getUsername()
            });

            if (!this.requestWasSuccess(response)) {
                throw new Error(`GH Request error. Status code: ${response.status}`);
            }

            return new URL(response.data.html_url);
        } catch (e) {
            throw new GithubClientError(`Error while adding collaborator ${collaborator.getUsername()} to repository candidate repository ${candidateChallenge.getCandidateChallengeUrl()}. Error: ${e.message}`);
        }
    }

    async createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<URL> {
        try {
            const { owner, repo } = this.parseOwnerAndRepo(challenge.getUrl()); 
            const candidateGithubUsername = candidate.getGithubUser().getUsername();
            const repoName = `test_${repo}_${candidateGithubUsername}`;

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

    async createIssueForCandidateChallenge(candidateChallenge: CandidateChallenge, challenge: Challenge): Promise<URL> {
        try {
            const { owner, repo } = this.parseOwnerAndRepo(challenge.getUrl()); 

            const response = await octokit.rest.issues.create({
                owner,
                repo,
                title: `Code Challenge for ${candidateChallenge.getCandidate().getName()}`,
                body: `Github Alias: ${candidateChallenge.getCandidate().getGithubUser().getUsername()}\nCoding Challenge Link: ${candidateChallenge.getCandidateChallengeUrl()}\nResume Link: ${candidateChallenge.getCandidate().getResumeUrl()}`
            });

            if (!this.requestWasSuccess(response)) {
                throw new Error(`GH Request error. Status code: ${response.status}`);
            }

            return new URL(response.data.html_url);
        } catch (e) {
            throw new GithubClientError(`Error while creating issue for candidate challenge. Error: ${e.message}`);
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

    private parseOwnerAndRepo(url: URL): { owner: string, repo: string } {
        const [ owner, repo ] =  url.pathname.substring(1).split('/');
        return { owner , repo };
    }
}