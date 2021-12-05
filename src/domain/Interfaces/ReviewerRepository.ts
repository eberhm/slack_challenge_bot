import { Reviewer } from "../Entities/Reviewer";
import { Identifier } from "../ValueObjects/Identifier";

export default interface ReviewerRepository {
    storage: any;
    save(reviewer: Reviewer): Promise<Reviewer>;
    findByIds(ids: Array<Identifier>): Promise<Array<Reviewer>>;
}