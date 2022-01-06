import { App, ViewSubmitAction } from '@slack/bolt';
import { registerChallengePayload, CALLBACK_ID as REGISTER_CHALLENGE_CALLBACK_ID, registerChallengeSuccessResponse } from '../payloads/RegisterChallengePayloads';
import { sendChallengePayload, CALLBACK_ID as SEND_CHALLENGE_CALLBACK_ID, sendChallengeSuccessResponse } from '../payloads/SendChallengePayloads';
import { ChallengeRepository } from '../../../ChallengeRepository';
import { CreateChallengeUseCase, CreateChallengeUseCaseOptions } from '../../../../application/usecases/CreateChallengeUseCase';
import { parseResponse } from '../lib/ResponseParser';
import { Challenge } from '../../../../domain/Entities/Challenge';
import { SendChallengeUseCase, SendChallengeUseCaseOptions } from '../../../../application/usecases/SendChallengeUseCase';
import { CandidateChallenge } from '../../../../domain/Entities/CandidateChallenge';
import { ReviewerRepository } from '../../../ReviewerRepository';

const challengeRepository = new ChallengeRepository();
const reviewersRepository = new ReviewerRepository();
const sendChallengeUseCase = SendChallengeUseCase.create(console);
const createChallengeUseCase = CreateChallengeUseCase.create(console);

export const register = (app: App) => {

    app.view<ViewSubmitAction>(REGISTER_CHALLENGE_CALLBACK_ID, async ({ ack, view, body, client }) => {
        try {
            await ack({ response_action: 'clear' });

            const channel = JSON.parse(view.private_metadata).channel;
            const values = parseResponse(view.state.values);
            const useCaseOptions: CreateChallengeUseCaseOptions = {
                challengeName: values.code_challenge_name,
                chanllengeUrl: values.github_repo_url
            };
    
            const challenge: Challenge = await createChallengeUseCase.run(useCaseOptions);
    
            client.chat.postMessage({
                channel: channel.id,
                blocks: registerChallengeSuccessResponse(challenge)
            });
        } catch (e) {
            client.chat.postMessage({
                channel: body.user.id,
                text: `There was an error while registering the challenge. Error: ${e.message}`
            });
        }
    });

    app.view<ViewSubmitAction>(SEND_CHALLENGE_CALLBACK_ID, async ({ body, client, ack, view }) => {
        try {
            await ack({ response_action: 'clear' });

            const values = parseResponse(view.state.values);
            const channel = JSON.parse(view.private_metadata).channel;
            const reviewers = await reviewersRepository.findBySlackIds([ values.reviewer1, values.reviewer2 ]);
            const challenge = await challengeRepository.findByName(values.challenge_name);
            const useCaseOptions: SendChallengeUseCaseOptions = {
                candidateName: values.candidate_name,
                challengeName: values.challenge_name,
                githubUser: values.candidate_github_username,
                resumeUrl: values.candidate_resume_url,
                reviewer1: values.reviewer1,
                reviewer2: values.reviewer2
            };
    
            const candidateChallenge: CandidateChallenge = await sendChallengeUseCase.run(useCaseOptions);
    
            client.chat.postMessage({
                channel: channel.id,
                blocks: sendChallengeSuccessResponse(candidateChallenge, challenge, reviewers || [])
            });
        } catch (e) {
            client.chat.postMessage({
                channel: body.user.id,
                text: `There was an error while sending the Code Challenge. Error: ${e.message}`
            });
        }
    });

    app.command('/challenge', async ({ command, ack, body, client, respond }) => {
        await ack();


        const payloadMetadata = {
            channel: {
                id: command.channel_id,
                name: command.channel_name
            }
        };

        switch (command.text) {
            case 'send':
                const challenges = await challengeRepository.findAll();
                if (!Array.isArray(challenges) || challenges.length <= 0) {
                    respond(`There are no challenges registered. You should register first a challenge. Use \`/challenge register\``);
                } else {
                    await client.views.open(sendChallengePayload(body.trigger_id, challenges, payloadMetadata))
                }
                break;
            case 'register':
                await client.views.open(registerChallengePayload(body.trigger_id, payloadMetadata));
                break;
            default:
                respond(`Command not defined. Allowed commands: send, register`);
                break;
        }
    });
}