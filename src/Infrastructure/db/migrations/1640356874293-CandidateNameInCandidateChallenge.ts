import {MigrationInterface, QueryRunner} from "typeorm";

export class CandidateNameInCandidateChallenge1640356874293 implements MigrationInterface {
    name = 'CandidateNameInCandidateChallenge1640356874293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate_challenge\` ADD \`candidateName\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate_challenge\` DROP COLUMN \`candidateName\``);
    }

}
