import type { Arguments, CommandBuilder } from 'yargs';
import { CreateChallenge } from '../../../domain/Services/CreateChallenge';
import { GithubClient } from '../../../Infrastructure/GithubClient';
import { ChallengeRepository } from '../../../Infrastructure/ChallengeRepository';

type Options = {
  challengeName: string;
  repositoryName: string;
};

export const command: string = 'create_challenge <challengeName> <repositoryName>';
export const desc: string = 'Creates a challenge using the github repositoryName as template <respositoryName> identifying it under the specified <challengeName>';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
  .parserConfiguration({
    "dot-notation": false
  })
  .positional('challengeName', { type: 'string', demandOption: true })
  .positional('repositoryName', { type: 'string', demandOption: true });
    

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { challengeName, repositoryName }: Options = argv;

  try {
    const service = new CreateChallenge(
      new ChallengeRepository(),
      new GithubClient()
    );

    await service.run(challengeName, repositoryName);
    process.stdout.write(`Challenge ${repositoryName} created successfully`);
    process.exit(0);
  } catch(e) {
    process.stderr.write(`Error creating challenge ${repositoryName}: ${e.message}`);
  }
};