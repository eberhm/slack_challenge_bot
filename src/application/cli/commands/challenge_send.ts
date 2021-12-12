import type { Arguments, CommandBuilder } from 'yargs';
import { InMemoryCandidateChallengeRepository } from '../../../../tests/Infrastructure/Repositories/InMemoryCandidateChallengeRepository';
import { InMemoryChallengeRepository } from '../../../../tests/Infrastructure/Repositories/InMemoryChallengeRepository';
import { InMemoryReviewerRepository } from '../../../../tests/Infrastructure/Repositories/InMemoryReviewerRepository';
import { CreateCandidateChallenge } from '../../../domain/Services/CreateCandidateChallenge';
import { CreateReviewer } from '../../../domain/Services/CreateReviewer';
import { Candidate } from '../../../domain/ValueObjects/Candidate';
import { Identifier } from '../../../domain/ValueObjects/Identifier';
import { GithubClient } from '../../../Infrastructure/GithubClient';

type Options = {
  gitUrl: string;
  candidateGithubName: string;
  challengeId: Identifier;
  reviewerSlackId1: string;
  reviewerSlackId2: string;
};

export const command: string = 'challenge_send <gitUrl> <candidateId> <challengeId> <reviewerId1> <reviewerId2>';
export const desc: string = 'Creates a challenge based on a challenge as template and assigns its reviewes and the candidate to the github repository';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .positional('gitUrl', { type: 'string', demandOption: true })
    .positional('candidateGithubName', { type: 'string', demandOption: true })
    .positional('challengeId', { type: 'string', demandOption: true })
    .positional('reviewerSlackId1', { type: 'string', demandOption: true })
    .positional('reviewerSlackId2', { type: 'string', demandOption: true })
;
    

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { 
    gitUrl,
    candidateGithubName,
    challengeId,
    reviewerSlackId1,
    reviewerSlackId2
   }: Options = argv;

  try {
    const service = new CreateCandidateChallenge(
      new InMemoryCandidateChallengeRepository(),
      new InMemoryReviewerRepository(),
      new InMemoryChallengeRepository(),
      new GithubClient()
    );

    await service.run(
      gitUrl,
      [reviewerSlackId1, reviewerSlackId2],
      candidateGithubName,
      challengeId
    );
   //process.stdout.write(`Reviewer created. SlackId: ${gitUrl}, githubUsername: ${githubUsername}`);
    process.exit(0);
  } catch(e) {
    //process.stderr.write(`Error creating Reviewer: ${e.message}. SlackId: ${slackId}, githubUsername: ${githubUsername}`);
  }
};