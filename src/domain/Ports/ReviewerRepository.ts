import { Reviewer } from '../Entities/Reviewer';
import { Identifier } from '../ValueObjects/Identifier';
import { SlackId } from '../ValueObjects/SlackUser';

export interface ReviewerRepository {
    save(reviewer: Reviewer): Promise<Reviewer>;
    findByIds(ids: Array<Identifier>): Promise<Reviewer[] | undefined >;
    findBySlackIds(slackIds: Array<SlackId>): Promise<Reviewer[] | undefined >;
}
