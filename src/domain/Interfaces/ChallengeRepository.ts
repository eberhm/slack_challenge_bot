import { Challenge } from "../Entities/Challenge";

export default interface ChallengeRepository {
    create(challenge: Challenge): Promise<Challenge>;
}