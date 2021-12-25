import type { Arguments, CommandBuilder } from 'yargs';
import { CreateReviewerUseCase, CreateReviewerUseCaseOptions } from '../../usecases/CreateReviewerUseCase';
import { Logger } from '../lib/Logger';

export const command: string = 'create_reviewer <slackId> <githubUsername>';
export const desc: string = 'Creates a reviewer establishing the relation between the slackId and the github username';

export const builder: CommandBuilder<CreateReviewerUseCaseOptions, CreateReviewerUseCaseOptions> = (yargs) =>
  yargs
  .parserConfiguration({
    "dot-notation": false
  })
  .positional('slackId', { type: 'string', demandOption: true })
  .positional('githubHandler', { type: 'string', demandOption: true });
    

export const handler = async (argv: Arguments<CreateReviewerUseCaseOptions>): Promise<void> => {
  try {
    const createReviewerUseCase = CreateReviewerUseCase.create(new Logger());
    createReviewerUseCase.run(argv);
    process.exit(0);
  } catch(e) {
    process.stderr.write(e.message);
    process.exit(1);
  }
};