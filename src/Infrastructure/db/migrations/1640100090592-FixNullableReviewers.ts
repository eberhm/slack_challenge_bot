import {MigrationInterface, QueryRunner} from "typeorm";

export class FixNullableReviewers1640100090592 implements MigrationInterface {
    name = 'FixNullableReviewers1640100090592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate_challenge\` CHANGE \`reviewerId1\` \`reviewerId1\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate_challenge\` CHANGE \`reviewerId2\` \`reviewerId2\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate_challenge\` CHANGE \`reviewerId2\` \`reviewerId2\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate_challenge\` CHANGE \`reviewerId1\` \`reviewerId1\` varchar(255) NOT NULL`);
    }

}
