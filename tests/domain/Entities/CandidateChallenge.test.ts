import 'jest';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { CandidateChallenge, EmptyReviewersSetError } from '../../../src/domain/Entities/CandidateChallenge';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { Identifier } from '../../../src/domain/ValueObjects/Identifier';

describe('CandidateChanllenge Entity', () => {
    const ANY_ID = "anystring";
    const ANY_URL = new URL('https://anything.com');

    it('Can be created having a valid state', () => {

        const candidate = new Candidate(new GithubUser('anothervalid.user'), ANY_URL);
        const challenge = CandidateChallenge.create(
            ANY_URL,
            candidate,
            [ANY_ID],
            ANY_ID
        );

        expect(challenge.getId()).not.toBe(null);
        expect(challenge.getUrl()).toBe(ANY_URL);
        expect(challenge.getReviewerIds()).toEqual([ ANY_ID ]);
        expect(challenge.getChallengeId()).toBe(ANY_ID);
        expect(challenge.getCandidate()).toBe(candidate);
    });

    it('Cannot be created having an empty reviewers state', () => {
        const emptyReviewers: Array<Identifier> = [];

        expect(() => {
            const challenge = CandidateChallenge.create(
                ANY_URL,
                new Candidate(new GithubUser('anothervalid.user'), ANY_URL),    
                emptyReviewers,
                ANY_ID
            );
        }).toThrowError(EmptyReviewersSetError);
    });
});