import 'jest';
import { CandidateChallenge as CandidateChallengeEntity } from '../../../../src/domain/Entities/CandidateChallenge';
import { Candidate } from '../../../../src/domain/ValueObjects/Candidate';
import { mapToOrm, buildFromOrm, CandidateChallenge } from '../../../../src/Infrastructure/db/entity/CandidateChallenge';

describe('CandidateChanllenge mappers', () => {
    const ANY_ID = "anystring";
    const ANY_NAME = "any name";
    const ANY_URL = new URL('https://anything.com');
    const ANY_VALID_GH_USERNAME = 'anothervalid.user';

    const createOrmEntity = (challengeId) => ({
        id: challengeId,
        candidateChallengeUrl: ANY_URL.toString(),
        candidateName: ANY_NAME,
        reviewerId1: ANY_ID,
        reviewerId2: undefined,
        githubUsername: ANY_VALID_GH_USERNAME,
        resumeUrl: ANY_URL.toString(),
        challengeId: ANY_ID
    });

    const createDomainEntity = () => {
        const candidate = Candidate.create(ANY_NAME, ANY_VALID_GH_USERNAME, ANY_URL);
        const challenge = CandidateChallengeEntity.create(
            ANY_URL,
            candidate,
            [ANY_ID],
            ANY_ID
        );

        return challenge;
    }
    it('maps an Domain Entity to TypeORM entity', () => {

        const challenge = createDomainEntity();

        const ormEntity = mapToOrm(challenge);

        const expectedOrmEntity = createOrmEntity(challenge.getId());

        expect(ormEntity).toEqual<CandidateChallenge>(expectedOrmEntity);
    });

    it('maps an TypeORM Entity to a Domain entity', () => {

        const expectedDomainEntity = createDomainEntity();
        const ormEntity = createOrmEntity(expectedDomainEntity.getId());

        const domainEntity = buildFromOrm(ormEntity);

        expect(domainEntity).toEqual<CandidateChallengeEntity>(expectedDomainEntity);
    });
});

