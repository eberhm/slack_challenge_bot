import type { Arguments, CommandBuilder } from 'yargs';
import { InMemoryReviewerRepository } from '../../../../tests/Infrastructure/Repositories/InMemoryReviewerRepository';
import { CreateReviewer } from '../../../domain/Services/CreateReviewer';

type Options = {
  slackId: string;
  githubUsername: string;
};

export const command: string = 'create_reviewer <slackId> <githubUsername>';
export const desc: string = 'Creates a reviewer establishing the relation between the slackId and the github username';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
  .positional('slackId', { type: 'string', demandOption: true })
  .positional('githubHandler', { type: 'string', demandOption: true });
    

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { slackId, githubUsername }: Options = argv;

  try {
    const service = new CreateReviewer(
      new InMemoryReviewerRepository()
    );

    await service.run(githubUsername, slackId);
    process.stdout.write(`Reviewer created. SlackId: ${slackId}, githubUsername: ${githubUsername}`);
    process.exit(0);
  } catch(e) {
    process.stderr.write(`Error creating Reviewer: ${e.message}. SlackId: ${slackId}, githubUsername: ${githubUsername}`);
  }
};