import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { Identifier } from '../ValueObjects/Identifier';
import { CandidateChallengeRepository } from '../Interfaces/CandidateChallengeRepository';
import { Candidate } from '../ValueObjects/Candidate';
import { ChallengeRepository } from '../Interfaces/ChallengeRepository';
import { GithubCodeChallenge } from '../ValueObjects/GithubCodeChallenge';
import { CreateGithubChallenge } from './CreateGithubChallenge';

export class CreateCandidateChallengeError extends Error {}

export class CreateCandidateChallenge {

    private candidateChallengeRepository: CandidateChallengeRepository;
    private challengesRepository: ChallengeRepository;
    private createGithubChallengeService: CreateGithubChallenge;

    public constructor(
      candidateChallengeRepository: CandidateChallengeRepository,
      challengesRepository: ChallengeRepository,
      createGithubChallengeService: CreateGithubChallenge
    ) {
      this.candidateChallengeRepository = candidateChallengeRepository;
      this.challengesRepository = challengesRepository;
      this.createGithubChallengeService = createGithubChallengeService;
    }

    public async run(
      candidate: Candidate,
      challengeId: Identifier,
    ): Promise<CandidateChallenge> {
      try {
        const challenge = await this.challengesRepository.findById(challengeId);

        let ghCodeChallenge: GithubCodeChallenge;
        if (challenge) {
          ghCodeChallenge = await this.createGithubChallengeService.run(
            challenge,
            candidate,
          );
        } else {
          throw new CreateCandidateChallengeError(`Challenge with id: ${challengeId} not found`);
        }

        const candidateChallenge = CandidateChallenge.create(
          ghCodeChallenge.getUrl(),
          candidate,
          [],
          challengeId,
        );

        return await this.candidateChallengeRepository.save(candidateChallenge);
      } catch (e) {
        throw new CreateCandidateChallengeError(e.message);
      }
    }
}
