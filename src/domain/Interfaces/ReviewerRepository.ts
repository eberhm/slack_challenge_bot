import { Reviewer } from '../Entities/Reviewer';
import { Identifier } from '../ValueObjects/Identifier';

export interface ReviewerRepository {
    save(reviewer: Reviewer): Promise<Reviewer>;
    findByIds(ids: Array<Identifier>): Promise<Array<Reviewer>>;
}
