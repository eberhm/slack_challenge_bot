import 'jest';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import { CreateGithubChallenge } from '../../../src/domain/Services/CreateGithubChallenge';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { SandboxedGithubClient } from '../../Infrastructure/Repositories/SandboxedGithubClient';

describe('CreateReviewer Service creates a reviewer and returns it newly inserted in the DB', () => {
    const ANY_VALID_URL = 'http://www.valid_url.tld';
    const ANY_VALID_RESUME_URL = 'http://www.valid_resume_url.tld';
    const ANY_CHALLENGE_NAME = 'ANY_CHALLENGE_NAME';
    const ANY_GH_USERNAME = 'ANY_GITHUB_USERNAME';

    it('can create a GithubChallenge object', async () => {
        const challenge = Challenge.create(ANY_CHALLENGE_NAME, new URL(ANY_VALID_URL));
        const candidate = Candidate.create(ANY_GH_USERNAME, new URL(ANY_VALID_RESUME_URL));
        const service = new CreateGithubChallenge(new SandboxedGithubClient());
        const createdCodeChallenge = await service.run(challenge, candidate);

        expect(createdCodeChallenge.getUrl()).not.toBe(null);
    });
});
