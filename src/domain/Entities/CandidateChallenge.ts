import { Candidate } from "./Candidate";
import { Challenge } from "./Challenge";
import { Reviewer } from "./Reviewer";


export class EmptyReviewersSetError extends Error {};

export class CandidateChallenge {
    private githubRepositoryUrl: URL;
    private reviewers: Array<Reviewer>;
    private candidate: Candidate;
    private challenge: Challenge;

    constructor(url: URL, candidate: Candidate, reviewers: Array<Reviewer>, challenge: Challenge) {
        if (reviewers.length === 0) {
            throw new EmptyReviewersSetError('The reviewers list is empty');
        }
        this.githubRepositoryUrl = url;
        this.reviewers = reviewers;
        this.candidate = candidate;
        this.challenge = challenge;
    }

    public getUrl():URL {
        return this.githubRepositoryUrl;
    }

    public getReviewers(): Array<Reviewer> {
        return this.reviewers;
    }

    public getCandidate(): Candidate {
        return this.candidate;
    }

    public getChallenge(): Challenge {
        return this.challenge;
    }
}