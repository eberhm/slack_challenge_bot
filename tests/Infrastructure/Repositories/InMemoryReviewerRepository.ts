import { Reviewer } from "../../../src/domain/Entities/Reviewer";
import { Identifier } from "../../../src/domain/ValueObjects/Identifier";
import { ReviewerRepository } from "../../../src/domain/Interfaces/ReviewerRepository";
import { SlackId } from "../../../src/domain/ValueObjects/SlackUser";

/*
    * Usage of .map and .filter over the Array would been cleaner but we need to 
    * separate result type from direct .map or .filter results as they are T | undefined 
    * in order to help Typescript to understand the correct type (as we use strictNullChecks). 
    */
export class InMemoryReviewerRepository implements ReviewerRepository {

    private storage: Map<Identifier, Reviewer> = new Map();

    save(reviewer: Reviewer): Promise<Reviewer> {
        try {
            this.storage.set(reviewer.getId(), reviewer);
        } catch (e) {
            return Promise.reject(new Error(`Error saving Challenge: ${e.message}`));
        }

        return Promise.resolve(reviewer);
    }

    findBySlackIds(slackIds: SlackId[]): Promise<Reviewer[] | undefined> {
        const reviewers: Reviewer[] = [];
        this.storage.forEach((reviewer) => {
            if (slackIds.includes(reviewer.getSlackUser().getUserId())) {
                reviewers.push(reviewer);
            }
        });
        
        if (reviewers.length <= 0) {
            return Promise.resolve(undefined);
        } else {
            return Promise.resolve(reviewers);
        }
    }

    findByIds(ids: Array<Identifier>): Promise<Reviewer[] | undefined > {
        const reviewers: Reviewer[] = [];
        ids.forEach((id) => {
            if (this.storage.has(id)) {
                reviewers.push(this.storage.get(id) as Reviewer);
            }
        });

        if (reviewers.length <= 0) {
            return Promise.resolve(undefined);
        } else {
            return Promise.resolve(reviewers);
        }
    }
}