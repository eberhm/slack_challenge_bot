import { Reviewer } from "../Entities/Reviewer";

export default interface ReviewerRepository {
    create(reviewer: Reviewer): Promise<Reviewer>;
}