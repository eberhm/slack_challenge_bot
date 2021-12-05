import 'jest';
import { Challenge } from '../../../src/domain/Entities/Challenge';

describe('Chanllenge Entity works as expected', () => {
    it('Has a valid URL defined', () => {
        const ANY_URL = new URL('https://anything.com');

        const challenge = Challenge.create(ANY_URL);
        expect(challenge.getUrl()).toBe(ANY_URL);
        expect(challenge.getId()).not.toBe(null);
    });
});