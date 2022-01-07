import { Challenge } from '../Entities/Challenge';
import { Identifier } from '../ValueObjects/Identifier';

export interface ChallengeRepository {
    save(challenge: Challenge): Promise<Challenge>;
    findById(id: Identifier): Promise<Challenge | undefined>;
    findByName(name: string): Promise<Challenge | undefined>;
    findAll(): Promise<Challenge[] | undefined>;
};
