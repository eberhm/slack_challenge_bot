import { Candidate } from '../ValueObjects/Candidate';
import { generateUuid, Identifier } from '../ValueObjects/Identifier';

export class EmptyReviewersError extends Error {}

export class CandidateChallenge {
    private id: Identifier;

    private candidateChallengeUrl: URL;

    private reviewerIds: Array<Identifier>;

    private candidate: Candidate;

    private challengeId: Identifier;

    static create(
      url: URL,
      candidate: Candidate,
      reviewerIds: Array<Identifier>,
      challengeId: Identifier,
    ) {
      const id = generateUuid('CandidateChallenge');
      return new this(id, url, candidate, reviewerIds, challengeId);
    }

    private constructor(
      id: Identifier,
      candidateChallengeUrl: URL,
      candidate: Candidate,
      reviewerIds: Array<Identifier>,
      challengeId: Identifier,
    ) {
      this.id = id;
      this.candidateChallengeUrl = candidateChallengeUrl;
      this.reviewerIds = reviewerIds;
      this.candidate = candidate;
      this.challengeId = challengeId;
    }

    public getId() {
      return this.id;
    }

    public getCandidateChallengeUrl(): URL {
      return this.candidateChallengeUrl;
    }

    public getReviewerIds(): Array<Identifier> {
      return this.reviewerIds;
    }

    public setReviewerIds(reviewerIds: Identifier[]) {
      this.reviewerIds = reviewerIds;  
    }

    public getCandidate(): Candidate {
      return this.candidate;
    }

    public getChallengeId(): Identifier {
      return this.challengeId;
    }
}
