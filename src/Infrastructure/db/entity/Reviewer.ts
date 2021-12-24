import { Identifier } from "../../../domain/ValueObjects/Identifier";
import { Reviewer as ReviewerEntity } from "../../../domain/Entities/Reviewer"
import { Entity, Column, PrimaryColumn } from "typeorm";
import { GithubUser } from "../../../domain/ValueObjects/GithubUser";
import { SlackId, SlackUser } from "../../../domain/ValueObjects/SlackUser";

@Entity()
export class Reviewer {

    @PrimaryColumn()
    id: Identifier;

    @Column()
    githubUsername: string;

    @Column()
    slackUserId: SlackId;
}

export const buildFromOrm = (reviewer: Reviewer): ReviewerEntity => {
    return new ReviewerEntity(
            reviewer.id,
            new GithubUser(reviewer.githubUsername),
            new SlackUser(reviewer.slackUserId)
        );
}

export const mapToOrm = (reviewer: ReviewerEntity): Reviewer => {
    const DTO = new Reviewer();

    DTO.id = reviewer.getId();
    DTO.githubUsername = reviewer.getGithubUser().getUsername();
    DTO.slackUserId = reviewer.getSlackUser().getUserId();

    return DTO;
}
