import { Reviewer } from "../../../src/domain/Entities/Reviewer";
import { Identifier } from "../../../src/domain/Interfaces/Identifier";
import ReviewerRepository from "../../../src/domain/Interfaces/ReviewerRepository";
import { GithubUser } from "../../../src/domain/ValueObjects/GithubUser";

export interface InMemoryReviewerIdentifier extends Identifier {
    value: GithubUser
};

export class InMemoryReviewerRepository implements ReviewerRepository {
    public storage: WeakMap<InMemoryReviewerIdentifier, Reviewer> = new WeakMap();
    
    public create(reviewer: Reviewer): Promise<Reviewer> {
        const id = { value: reviewer.getGithubUser() };
        const newReviewer = new Reviewer(
            id, 
            reviewer.getGithubUser(), 
            reviewer.getSlackUser()
        );

        this.storage.set(id, newReviewer);

        return Promise.resolve(newReviewer);
    }
    
    
    public findById(id: InMemoryReviewerIdentifier): Promise<Reviewer> {
        return Promise.resolve(this.storage.get(id));
    }
}