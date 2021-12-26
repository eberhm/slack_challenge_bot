import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { Identifier } from '../ValueObjects/Identifier';
import { CandidateChallengeRepository } from '../Interfaces/CandidateChallengeRepository';
import { Candidate } from '../ValueObjects/Candidate';
import { ChallengeRepository } from '../Interfaces/ChallengeRepository';
import { GithubClientInterface } from '../Interfaces/GithubClientInterface';

export class CreateCandidateChallengeError extends Error {}

export class CreateCandidateChallenge {

    private candidateChallengeRepository: CandidateChallengeRepository;
    private challengesRepository: ChallengeRepository;
    private githubClient: GithubClientInterface;

    public constructor(
      candidateChallengeRepository: CandidateChallengeRepository,
      challengesRepository: ChallengeRepository,
      githubClient: GithubClientInterface
    ) {
      this.candidateChallengeRepository = candidateChallengeRepository;
      this.challengesRepository = challengesRepository;
      this.githubClient = githubClient;
    }

    public async run(
      candidate: Candidate,
      challengeId: Identifier,
    ): Promise<CandidateChallenge> {
      try {
        const challenge = await this.challengesRepository.findById(challengeId);

        let ghCodeChallenge: URL;
        if (challenge) {
          ghCodeChallenge = await this.githubClient.createChallengeForCandidate(
            challenge,
            candidate,
          );
        } else {
          throw new CreateCandidateChallengeError(`Challenge with id: ${challengeId} not found`);
        }

        const candidateChallenge = CandidateChallenge.create(
          ghCodeChallenge,
          candidate,
          [],
          challengeId,
        );

        await this.githubClient.addCollaboratorToCandidateChallenge(candidateChallenge, candidate.getGithubUser())
        
        return await this.candidateChallengeRepository.save(candidateChallenge);
      } catch (e) {
        throw new CreateCandidateChallengeError(e.message);
      }
    }
}
