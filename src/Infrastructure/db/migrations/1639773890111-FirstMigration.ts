import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1639773890111 implements MigrationInterface {
    name = 'FirstMigration1639773890111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`candidate_challenge\` (\`id\` varchar(255) NOT NULL, \`candidateChallengeUrl\` varchar(255) NOT NULL, \`reviewerId1\` varchar(255) NOT NULL, \`reviewerId2\` varchar(255) NOT NULL, \`githubUsername\` varchar(255) NOT NULL, \`resumeUrl\` varchar(255) NOT NULL, \`challengeId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`challenge\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`githubRepositoryUrl\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviewer\` (\`id\` varchar(255) NOT NULL, \`githubUsername\` varchar(255) NOT NULL, \`slackUserId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`reviewer\``);
        await queryRunner.query(`DROP TABLE \`challenge\``);
        await queryRunner.query(`DROP TABLE \`candidate_challenge\``);
    }

}
