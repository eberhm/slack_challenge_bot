import type { Arguments, CommandBuilder } from 'yargs';
import { CandidateChallengeRepository } from '../../../Infrastructure/CandidateChallengeRepository';
import { ChallengeRepository } from '../../../Infrastructure/ChallengeRepository';
import { ReviewerRepository } from '../../../Infrastructure/ReviewerRepository';
import { AddReviewersToCodeChallenge } from '../../../domain/Services/AddReviewersToCodeChallenge';
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

    const challengeRepository = new ChallengeRepository();
    const githubClient = new GithubClient();
    const candidateChallengeRepository = new CandidateChallengeRepository();
    const reviewersRepository = new ReviewerRepository();

    const createCandidateChallengeService = new CreateCandidateChallenge(
      candidateChallengeRepository,
      challengeRepository,
      githubClient
    );

    const addReviewersToChallengeService = new AddReviewersToCodeChallenge(
      candidateChallengeRepository,
      reviewersRepository,
      githubClient
    );

    const candidate = Candidate.create(githubUser, new URL(resumeUrl));
    const challenge = await challengeRepository.findByName(challengeName);

    if (!challenge) {
      throw new Error(`Challenge with name: ${challengeName} not found!`);
    }

    const candidateChallenge = await createCandidateChallengeService.run(candidate, challenge.getId());

    process.stdout.write(`Candidate Challenge created with id ${candidateChallenge.getId()}`);
    
    //adding now the reviewers

    await addReviewersToChallengeService.run(candidateChallenge, [ reviewer1, reviewer2 ]);

    process.stdout.write(`Reviewers added to Candidate Challenge with id ${candidateChallenge.getId()}`);
    process.stdout.write(`Reviewers: ${reviewer1}, ${reviewer2}`);

    process.exit(0);
  } catch(e) {
    process.stderr.write(`Error creating candidate challenge: ${e.message}`);
    process.exit(1);
  }
};