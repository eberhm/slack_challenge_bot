import { Candidate, Reviewer } from "./Reviewer";

export class Challenge {
    private githubRepositoryUrl: URL;

    constructor(url: URL) {
        this.githubRepositoryUrl = url;
    }

    public getUrl():URL {
        return this.githubRepositoryUrl;
    }
}

export class EmptyReviewersSet extends Error {};

export class CandidateChallenge {
    private githubRepositoryUrl: URL;
    private reviewers: Array<Reviewer>;
    private candidate: Candidate;

    constructor(url: URL, candidate: Candidate, reviewers: Array<Reviewer>) {
        if (reviewers.length === 0) {
            throw new EmptyReviewersSet('The reviewers list is empty');
        }
        this.githubRepositoryUrl = url;
        this.reviewers = reviewers;
        this.candidate = candidate;
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
}