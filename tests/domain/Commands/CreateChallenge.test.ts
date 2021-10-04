import 'jest';
import { CreateChallenge, CreateChallengeCommand } from '../../../src/domain/Commands/CreateChallenge';
import { Challenge } from '../../../src/domain/Entities/Challenge';
import ChallengeRepository from '../../../src/domain/Interfaces/ChallengeRepository';

const ANY_ID = { value: 12345 };
const ANY_VALID_URL = 'https://valid.url'

class InMemoryChallengeRepository implements ChallengeRepository {
    public create(challenge: Challenge): Challenge {
        return new Challenge(ANY_ID, challenge.getUrl());
    }    
}

describe('CreateChallenge Command handler creates a challenge and returns it newly inserted in the DB', () => {

    it('can create a challenge', () => {

        const createChallengeCommand: CreateChallengeCommand = {
            chanllengeUrl: ANY_VALID_URL
        };

        const commandHandler = new CreateChallenge(new InMemoryChallengeRepository());
        const createdChallenge = commandHandler.run(createChallengeCommand);

        expect(createdChallenge.getId()).toBe(ANY_ID.value);
        expect(createdChallenge.getUrl().toString()).toBe(new URL(createChallengeCommand.chanllengeUrl).toString());
    });
});