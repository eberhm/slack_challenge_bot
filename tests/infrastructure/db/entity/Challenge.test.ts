import 'jest';
import { Challenge as ChallengeEntity } from '../../../../src/domain/Entities/Challenge';
import { mapToOrm, buildFromOrm, Challenge } from '../../../../src/Infrastructure/db/entity/Challenge';

describe('Chanllenge mappers', () => {
    const ANY_URL = new URL('https://anything.com');
    const ANY_NAME = 'any_name';

    
    const createOrmEntity = (challengeId): Challenge => ({
        id: challengeId,
        name: ANY_NAME,
        githubRepositoryUrl: ANY_URL.toString()
    });

    const createDomainEntity = (): ChallengeEntity => {
        const challenge = ChallengeEntity.create(ANY_NAME, ANY_URL);
        expect(challenge.getUrl()).toBe(ANY_URL);
        expect(challenge.getId()).not.toBe(null);

        return challenge;
    }
    it('maps an Domain Entity to TypeORM entity', () => {

        const challenge = createDomainEntity();

        const ormEntity = mapToOrm(challenge);

        const expectedOrmEntity = createOrmEntity(challenge.getId());

        expect(ormEntity).toEqual<Challenge>(expectedOrmEntity);
    });

    it('maps an TypeORM Entity to a Domain entity', () => {

        const expectedDomainEntity = createDomainEntity();
        const ormEntity = createOrmEntity(expectedDomainEntity.getId());

        const domainEntity = buildFromOrm(ormEntity);

        expect(domainEntity).toEqual<ChallengeEntity>(expectedDomainEntity);
    });
});

