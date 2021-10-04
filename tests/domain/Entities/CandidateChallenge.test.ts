import 'jest';
import { Candidate } from '../../../src/domain/Entities/Candidate';
import { CandidateChallenge, EmptyReviewersSetError } from '../../../src/domain/Entities/CandidateChallenge';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { SlackUser } from '../../../src/domain/ValueObjects/SlackUser';

describe('CandidateChanllenge Entity', () => {
    it('Can be created having a valid state', () => {
        const ANY_URL = new URL('https://anything.com');
        const reviewers: Array<Reviewer> = [
            new Reviewer(new GithubUser('valid.username1'), new SlackUser(12345)),
            new Reviewer(new GithubUser('valid.username2'), new SlackUser(67890))
        ];

        const challenge = new CandidateChallenge(
            ANY_URL,
            new Candidate(new GithubUser('anothervalid.user')),    
            reviewers,
            new Challenge(ANY_URL)
        );
        expect(challenge.getUrl()).toBe(ANY_URL);
        expect(challenge.getReviewers()).toBe(reviewers);
        expect(challenge.getChallenge().getUrl()).toBe(ANY_URL);
    });

    it('Cannot be created having an empty reviewers state', () => {
        const ANY_URL = new URL('https://anything.com');
        const emptyReviewers: Array<Reviewer> = [];
        expect(() => {
            const challenge = new CandidateChallenge(
                ANY_URL,
                new Candidate(new GithubUser('anothervalid.user')),    
                emptyReviewers,
                new Challenge(new URL(ANY_URL))
            );
        }).toThrowError(EmptyReviewersSetError);
    });
});