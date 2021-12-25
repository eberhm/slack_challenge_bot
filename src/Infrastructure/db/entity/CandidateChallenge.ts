import { Identifier } from "../../../domain/ValueObjects/Identifier";
import { Candidate } from "../../../domain/ValueObjects/Candidate";
import { CandidateChallenge as CandidateChallengeEntity } from "../../../domain/Entities/CandidateChallenge"
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class CandidateChallenge {

    @PrimaryColumn()
    id: Identifier;

    @Column()
    candidateName: string;

    @Column()
    candidateChallengeUrl: string;

    @Column({
        nullable: true,
    })
    reviewerId1?: Identifier;

    @Column({
        nullable: true,
    })
    reviewerId2?: Identifier;

    @Column()
    githubUsername: string;

    @Column()
    resumeUrl: string;

    @Column()
    challengeId: Identifier;
}

export const buildFromOrm = (candidateChallenge: CandidateChallenge): CandidateChallengeEntity => {
    const reviewerIds: Identifier[] = [];
    if (candidateChallenge.reviewerId1) {
        reviewerIds.push(candidateChallenge.reviewerId1);
    }

    if (candidateChallenge.reviewerId2) {
        reviewerIds.push(candidateChallenge.reviewerId2);
    }

    return new CandidateChallengeEntity(
        {
            id: candidateChallenge.id, 
            candidateChallengeUrl: new URL(candidateChallenge.candidateChallengeUrl), 
            candidate: Candidate.create(
                candidateChallenge.candidateName,
                candidateChallenge.githubUsername,
                new URL(candidateChallenge.resumeUrl)
            ), 
            reviewerIds,
            challengeId: candidateChallenge.challengeId
        });
}

export const mapToOrm = (candidateChallenge: CandidateChallengeEntity): CandidateChallenge => {
    const [ reviewerId1, reviewerId2 ] = candidateChallenge.getReviewerIds();
    const DTO = new CandidateChallenge();

    DTO.id = candidateChallenge.getId();
    DTO.candidateChallengeUrl = candidateChallenge.getCandidateChallengeUrl().toString();
    DTO.candidateName = candidateChallenge.getCandidate().getName();
    DTO.reviewerId1 = reviewerId1;
    DTO.reviewerId2 = reviewerId2;
    DTO.githubUsername = candidateChallenge.getCandidate().getGithubUser().getUsername();
    DTO.resumeUrl = candidateChallenge.getCandidate().getResumeUrl().toString();
    DTO.challengeId = candidateChallenge.getChallengeId();

    return DTO;
}
