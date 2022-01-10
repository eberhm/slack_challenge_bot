import 'jest';
import { Reviewer as ReviewerEntity } from '../../../../src/domain/Entities/Reviewer';
import { GithubUser } from '../../../../src/domain/ValueObjects/GithubUser';
import { SlackUser } from '../../../../src/domain/ValueObjects/SlackUser';
import { mapToOrm, buildFromOrm, Reviewer } from '../../../../src/Infrastructure/db/entity/Reviewer';

describe('Reviewer mappers', () => {
    const VALID_GH_USERNAME = 'valid.username';
    const VALID_SLACK_USERID = 'valid_slack_id';

    
    const createOrmEntity = (challengeId) => ({
        id: challengeId,
        githubUsername: VALID_GH_USERNAME,
        slackUserId: VALID_SLACK_USERID
    });

    const createDomainEntity = (): ReviewerEntity => {
        const githubUser = new GithubUser(VALID_GH_USERNAME);
        const slackUser = new SlackUser(VALID_SLACK_USERID);
        const reviewer = ReviewerEntity.create(githubUser, slackUser);

        return reviewer;
    }
    it('maps an Domain Entity to TypeORM entity', () => {

        const challenge = createDomainEntity();
        const ormEntity = mapToOrm(challenge);

        const expectedOrmEntity = createOrmEntity(challenge.getId());

        expect(ormEntity).toEqual<Reviewer>(expectedOrmEntity);
    });

    it('maps an TypeORM Entity to a Domain entity', () => {

        const expectedDomainEntity = createDomainEntity();
        const ormEntity = createOrmEntity(expectedDomainEntity.getId());

       const domainEntity = buildFromOrm(ormEntity);

       expect(domainEntity).toEqual<ReviewerEntity>(expectedDomainEntity);
    });
});

