import { SlackId } from '../domain/ValueObjects/SlackUser';
import { Repository, In } from 'typeorm';
import { Reviewer } from '../domain/Entities/Reviewer';
import { ReviewerRepository as ReviewerRepositoryInterface } from '../domain/Interfaces/ReviewerRepository';
import { getRepository } from './db/connection';
import { Reviewer as ReviewerDTO, mapToOrm, buildFromOrm } from './db/entity/Reviewer';


export class ReviewerRepository implements ReviewerRepositoryInterface {
    async findBySlackIds(slackIds: SlackId[]): Promise<Reviewer[] | undefined> {
        try {
            return await this.getOrmRepository()
                .then(repo => repo.find({
                    slackUserId: In(slackIds)
                }))
                .then(
                    (results) => results.map(buildFromOrm)
                );
        } catch (e) {
            throw new Error(`Error finding Reviewers with slackIds: ${slackIds.concat(', ')} Error: ${e.message}`);
        }
    }

    async findByIds(ids: string[]): Promise<Reviewer[]> {
        try {
            return await this.getOrmRepository()
                .then(repo => repo.findByIds(ids))
                .then(
                    (results) => results.map(buildFromOrm)
                );
        } catch (e) {
            throw new Error(`Error finding Reviewers with ids: ${ids.concat(', ')} Error: ${e.message}`);
        }
    }

    async save(reviewer: Reviewer): Promise<Reviewer> {
        try {
            await this.getOrmRepository()
            .then(
                repo => repo.save(mapToOrm(reviewer))
            );
        } catch (e) {
            throw new Error(`Error saving Reviewer to DB: ${e.message}`);
        }
        
        return Promise.resolve(reviewer);

    }

    private getOrmRepository(): Promise<Repository<ReviewerDTO>> {
        return getRepository(ReviewerDTO);
    }
}
