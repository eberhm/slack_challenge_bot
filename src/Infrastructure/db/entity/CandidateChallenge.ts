import { Identifier } from "../../../domain/ValueObjects/Identifier";
import { Candidate } from "../../../domain/ValueObjects/Candidate";
import { CandidateChallenge as CandidateChallengeEntity } from "../../../domain/Entities/CandidateChallenge"
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class CandidateChallenge {

    @PrimaryColumn()
    id: Identifier;

    @Column()
    candidateChallengeUrl: string;

    @Column({
        nullable: true,
    })
    reviewerId1: Identifier;

    @Column({
        nullable: true,
    })
    reviewerId2: Identifier;

    @Column()
    githubUsername: string;

    @Column()
    resumeUrl: string;

    @Column()
    challengeId: Identifier;
}

export const buildFromOrm = (candidateChallenge: CandidateChallenge): CandidateChallengeEntity => {
    return new CandidateChallengeEntity(
        {
            id: candidateChallenge.id, 
            candidateChallengeUrl: new URL(candidateChallenge.candidateChallengeUrl), 
            candidate: Candidate.create(
                candidateChallenge.githubUsername,
                new URL(candidateChallenge.resumeUrl)
            ), 
            reviewerIds: [candidateChallenge.reviewerId1, candidateChallenge.reviewerId2],
            challengeId: candidateChallenge.challengeId
        });
}

export const mapToOrm = (candidateChallenge: CandidateChallengeEntity): CandidateChallenge => {
    const [ reviewerId1, reviewerId2 ] = candidateChallenge.getReviewerIds();
    const DTO = new CandidateChallenge();

    DTO.id = candidateChallenge.getId();
    DTO.candidateChallengeUrl = candidateChallenge.getCandidateChallengeUrl().toString();
    DTO.reviewerId1 = reviewerId1;
    DTO.reviewerId2 = reviewerId2;
    DTO.githubUsername = candidateChallenge.getCandidate().getGithubUser().getUsername();
    DTO.resumeUrl = candidateChallenge.getCandidate().getResumeUrl().toString();
    DTO.challengeId = candidateChallenge.getChallengeId();

    return DTO;
}
