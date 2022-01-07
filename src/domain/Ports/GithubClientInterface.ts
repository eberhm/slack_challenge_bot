import { CandidateChallenge } from '../Entities/CandidateChallenge';
import { Challenge } from '../Entities/Challenge';
import { Candidate } from '../ValueObjects/Candidate';
import { GithubUser } from '../ValueObjects/GithubUser';

export interface GithubClientInterface {
    createChallengeForCandidate(challenge: Challenge, candidate: Candidate): Promise<URL>;
    addCollaboratorToCandidateChallenge(candidateChallenge: CandidateChallenge, collaborator: GithubUser): Promise<URL>;
    createIssueForCandidateChallenge(candidateChallenge: CandidateChallenge, challenge: Challenge): Promise<URL>;
    githubRepositoryExists(url: URL): Promise<boolean>;
}
