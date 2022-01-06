import type { Arguments, CommandBuilder } from 'yargs';
import { SendChallengeUseCase, SendChallengeUseCaseOptions } from '../../../../application/usecases/SendChallengeUseCase';
import { Logger } from '../lib/Logger';

export const command: string = 'send_challenge <challengeName> <githubUser> <resumeUrl> <reviewer1> <reviewer2>';
export const desc: string = 'Sends a challenge to a specific <ghUser> and add the <reviewersList> to it';

export const builder: CommandBuilder<SendChallengeUseCaseOptions, SendChallengeUseCaseOptions> = (yargs) => 
  yargs
    .parserConfiguration({
      "dot-notation": false
    })
    .positional('challengeName', { type: 'string', demandOption: true })
    .positional('candidateName', { type: 'string', demandOption: true })
    .positional('githubUser', { type: 'string', demandOption: true })
    .positional('resumeUrl', { type: 'string', demandOption: true })
    .positional('reviewer1', { type: 'string', demandOption: true })
    .positional('reviewer2', { type: 'string', demandOption: true })
  ;

export const handler = async (argv: Arguments<SendChallengeUseCaseOptions>): Promise<void> => {

  try {
    const sendChallengeUseCase = SendChallengeUseCase.create(new Logger());

    sendChallengeUseCase.run(argv);

    process.exit(0);
  } catch(e) {
    process.stderr.write(e.message);
    process.exit(1);
  }
};