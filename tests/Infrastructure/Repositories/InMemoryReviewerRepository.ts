import { Reviewer } from "../../../src/domain/Entities/Reviewer";
import { Identifier } from "../../../src/domain/ValueObjects/Identifier";
import { ReviewerRepository } from "../../../src/domain/Interfaces/ReviewerRepository";

/*
Cosas que hay que repensarse:

* El uso de Identofier tan complejo y devolver en los getId() solo el Id.value
* El uso de Map en los InMemoryRepository...no acaba de funcionar
* El uso de InMemoryRepository en si...no es mejor simplemente usar mocks puros?

*/
export class InMemoryReviewerRepository implements ReviewerRepository {
    public storage: Map<Identifier, Reviewer> = new Map();

    
    public save(reviewer: Reviewer): Promise<Reviewer> {
        try {
            this.storage.set(reviewer.getId(), reviewer);
        } catch (e) {
            return Promise.reject(new Error(`Error saving Challenge: ${e.message}`));
        }

        return Promise.resolve(reviewer);
    }
    
    
    public findByIds(ids: Array<Identifier>): Promise<Reviewer[]> {
        /*
        const challenge = this.storage.get(id) || Challenge.createEmpty()
        if (this.storage.has(id)) {
            return Promise.resolve(challenge);
        } else {
            return Promise.reject(new Error(`Challenge with id ${id} not found`));
        }
        */

        return Promise.resolve(ids.map((id) => {
            return this.storage.get(id) || Reviewer.createEmpty();
        }));
    }
}