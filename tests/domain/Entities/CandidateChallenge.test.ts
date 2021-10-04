import 'jest';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { CandidateChallenge, EmptyReviewersSetError } from '../../../src/domain/Entities/CandidateChallenge';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { SlackUser } from '../../../src/domain/ValueObjects/SlackUser';

describe('CandidateChanllenge Entity', () => {
    const ANY_ID = { value: 12345 };
    const ANY_URL = new URL('https://anything.com');

    it('Can be created having a valid state', () => {
        const reviewers: Array<Reviewer> = [
            new Reviewer(ANY_ID, new GithubUser('valid.username1'), new SlackUser(12345)),
            new Reviewer(ANY_ID, new GithubUser('valid.username2'), new SlackUser(67890))
        ];

        const candidate = new Candidate(new GithubUser('anothervalid.user'), ANY_URL);
        const challenge = new CandidateChallenge(
            ANY_ID,
            ANY_URL,
            candidate,    
            reviewers,
            new Challenge(ANY_ID, ANY_URL)
        );

        expect(challenge.getId()).toBe(ANY_ID.value);
        expect(challenge.getUrl()).toBe(ANY_URL);
        expect(challenge.getReviewers()).toBe(reviewers);
        expect(challenge.getChallenge().getUrl()).toBe(ANY_URL);
        expect(challenge.getCandidate()).toBe(candidate);
    });

    it('Cannot be created having an empty reviewers state', () => {
        const emptyReviewers: Array<Reviewer> = [];

        expect(() => {
            const challenge = new CandidateChallenge(
                ANY_ID,
                ANY_URL,
                new Candidate(new GithubUser('anothervalid.user'), ANY_URL),    
                emptyReviewers,
                new Challenge(ANY_ID, ANY_URL)
            );
        }).toThrowError(EmptyReviewersSetError);
    });
});