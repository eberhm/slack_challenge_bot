import { Identifier } from '../../../domain/ValueObjects/Identifier';
import { Challenge as ChallengeEntity } from '../../../domain/Entities/Challenge';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Challenge {

    @PrimaryColumn()
    id: Identifier;

    @Column()
    name: string;

    @Column()
    githubRepositoryUrl: string;
}

export const buildFromOrm = (challenge: Challenge): ChallengeEntity => {
    return new ChallengeEntity(
            challenge.id,
            challenge.name,
            new URL(challenge.githubRepositoryUrl)
        );
};

export const mapToOrm = (challenge: ChallengeEntity): Challenge => {
    const DTO = new Challenge();

    DTO.id = challenge.getId();
    DTO.name = challenge.getName();
    DTO.githubRepositoryUrl = challenge.getUrl().toString();

    return DTO;
};
