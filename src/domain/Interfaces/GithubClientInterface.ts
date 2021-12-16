import { Challenge } from '../Entities/Challenge';
import { Reviewer } from '../Entities/Reviewer';
import { Candidate } from '../ValueObjects/Candidate';

export interface GithubClientInterface {
    createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<URL>;
    addReviewersToCodeChallenge(candidateChallengeUrl: URL, reviewers: Reviewer[]): Promise<void>;
    githubRepositoryExists(url: URL): Promise<boolean>;
}
