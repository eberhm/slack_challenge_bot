import type { Arguments, CommandBuilder } from 'yargs';
import { CreateChallengeUseCase, CreateChallengeUseCaseOptions } from '../../../../application/usecases/CreateChallengeUseCase';
import { Logger } from '../lib/Logger';

export const command = 'create_challenge <challengeName> <repositoryName>';
export const desc = 'Creates a challenge using the github repositoryName as template <respositoryName> identifying it under the specified <challengeName>';

export const builder: CommandBuilder<CreateChallengeUseCaseOptions, CreateChallengeUseCaseOptions> = (yargs) =>
  yargs
  .parserConfiguration({
    'dot-notation': false
  })
  .positional('challengeName', { type: 'string', demandOption: true })
  .positional('chanllengeUrl', { type: 'string', demandOption: true });
    

export const handler = async (argv: Arguments<CreateChallengeUseCaseOptions>): Promise<void> => {

  try {
    const createChallengeUseCase = CreateChallengeUseCase.create(new Logger());
    await createChallengeUseCase.run(argv);

  } catch(e) {
    process.stderr.write(e.message);
    process.exit(1);
  }
};