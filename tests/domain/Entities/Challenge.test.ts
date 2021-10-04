import 'jest';
import { Challenge } from '../../../src/domain/Entities/Challenge';

describe('Chanllenge Entity works as expected', () => {
    it('Has a valid URL defined', () => {
        const ANY_URL = new URL('https://anything.com');
        const ANY_ID = { value: 1234 };
        const challenge = new Challenge(ANY_ID, ANY_URL);
        expect(challenge.getUrl()).toBe(ANY_URL);
        expect(challenge.getId()).toBe(ANY_ID.value);
    });
});