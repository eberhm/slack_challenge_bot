import { Identifier } from "../Interfaces/Identifier";
import { Candidate } from "../ValueObjects/Candidate";


export class EmptyReviewersSetError extends Error {};

export class CandidateChallenge {
    private id: Identifier;
    private githubRepositoryUrl: URL;
    private reviewerIds: Array<Identifier>;
    private candidate: Candidate;
    private challengeId: Identifier;

    constructor(id: Identifier, url: URL, candidate: Candidate, reviewerIds: Array<Identifier>, challengeId: Identifier) {
        if (reviewerIds.length === 0) {
            throw new EmptyReviewersSetError('The reviewers list is empty');
        }
        this.id = id;
        this.githubRepositoryUrl = url;
        this.reviewerIds = reviewerIds;
        this.candidate = candidate;
        this.challengeId = challengeId;
    }

    public getId() {
        return this.id.value;
    }

    public getUrl():URL {
        return this.githubRepositoryUrl;
    }

    public getReviewerIds(): Array<Identifier> {
        return this.reviewerIds;
    }

    public getCandidate(): Candidate {
        return this.candidate;
    }

    public getChallengeId(): Identifier {
        return this.challengeId;
    }
}
