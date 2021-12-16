import { Challenge } from '../Entities/Challenge';
import { Reviewer } from '../Entities/Reviewer';
import { Candidate } from '../ValueObjects/Candidate';
import { GithubCodeChallenge } from '../ValueObjects/GithubCodeChallenge';

export interface GithubClientInterface {
    createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<URL>;
    addReviewersToCodeChallenge(ghCodeChallenge: GithubCodeChallenge, reviewers: Reviewer[]): Promise<GithubCodeChallenge>;
    githubRepositoryExists(url: URL): Promise<boolean>;
}
