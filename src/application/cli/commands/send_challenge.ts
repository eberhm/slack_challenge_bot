import type { Arguments, CommandBuilder } from 'yargs';
import { InMemoryCandidateChallengeRepository } from '../../../../tests/Infrastructure/Repositories/InMemoryCandidateChallengeRepository';
import { InMemoryChallengeRepository } from '../../../../tests/Infrastructure/Repositories/InMemoryChallengeRepository';
import { CreateCandidateChallenge } from '../../../domain/Services/CreateCandidateChallenge';
import { Candidate } from '../../../domain/ValueObjects/Candidate';
import { GithubClient } from '../../../Infrastructure/GithubClient';

type Options = {
  challengeName: string;
  githubUser: string;
  resumeUrl: string;
  reviewer1: string;
  reviewer2: string;
};

export const command: string = 'send_challenge <challengeName> <githubUser> <resumeUrl> <reviewer1> <reviewer2>';
export const desc: string = 'Sends a challenge to a specific <ghUser> and add the <reviewersList> to it';

export const builder: CommandBuilder<Options, Options> = (yargs) => 
  yargs
    .parserConfiguration({
      "dot-notation": false
    })
    .positional('challengeName', { type: 'string', demandOption: true })
    .positional('githubUser', { type: 'string', demandOption: true })
    .positional('resumeUrl', { type: 'string', demandOption: true })
    .positional('reviewer1', { type: 'string', demandOption: true })
    .positional('reviewer2', { type: 'string', demandOption: true })
  ;
    

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { challengeName, githubUser, resumeUrl, reviewer1, reviewer2 }: Options = argv;

  try {

    const challengeRepository = new InMemoryChallengeRepository();
    const service = new CreateCandidateChallenge(
      new InMemoryCandidateChallengeRepository(),
      challengeRepository,
      new GithubClient()
    );

    const candidate = Candidate.create(githubUser, new URL(resumeUrl));
    const challenge = await challengeRepository.findByName(challengeName);

    if (!challenge) {
      throw new Error(`Challenge with name: ${challengeName} not found!`);
    }

    const candidateChallenge = await service.run(candidate, challenge.getId());

    process.stdout.write(`Candidate Challenge created with id ${candidateChallenge.getId()}`);
    
    //adding now the reviewers

    
    process.exit(0);
  } catch(e) {
    process.stderr.write(`Error creating candidate challenge: ${e.message}`);
  }
};