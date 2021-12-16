import 'jest';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { CandidateChallenge, EmptyReviewersError } from '../../../src/domain/Entities/CandidateChallenge';
import { Identifier } from '../../../src/domain/ValueObjects/Identifier';

describe('CandidateChanllenge Entity', () => {
    const ANY_ID = "anystring";
    const ANY_URL = new URL('https://anything.com');
    const ANY_VALID_GH_USERNAME = 'anothervalid.user';

    it('Can be created having a valid state', () => {

        const candidate = Candidate.create(ANY_VALID_GH_USERNAME, ANY_URL);
        const challenge = CandidateChallenge.create(
            ANY_URL,
            candidate,
            [ANY_ID],
            ANY_ID
        );

        expect(challenge.getId()).not.toBe(null);
        expect(challenge.getCandidateChallengeUrl()).toBe(ANY_URL);
        expect(challenge.getReviewerIds()).toEqual([ ANY_ID ]);
        expect(challenge.getChallengeId()).toBe(ANY_ID);
        expect(challenge.getCandidate()).toBe(candidate);
    });

    it('Can be created having an empty reviewers state', () => {
        const emptyReviewers: Array<Identifier> = [];

        const challenge = CandidateChallenge.create(
            ANY_URL,
            Candidate.create(ANY_VALID_GH_USERNAME, ANY_URL),
            emptyReviewers,
            ANY_ID
        );

        expect(challenge.getReviewerIds()).toEqual([]);
    });
});