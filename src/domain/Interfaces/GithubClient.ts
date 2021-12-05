import { Challenge } from "../Entities/Challenge";
import { Reviewer } from "../Entities/Reviewer";
import { Candidate } from "../ValueObjects/Candidate";
import { GithubCodeChallenge } from "../ValueObjects/GithubCodeChallenge";

export interface GithubClient {
    createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<GithubCodeChallenge>;
    addReviewersToCodeChallenge(ghCodeChallenge: GithubCodeChallenge, reviewers: Reviewer[]): void;
}