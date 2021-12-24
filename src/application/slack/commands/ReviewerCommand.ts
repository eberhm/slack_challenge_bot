import { App, ViewSubmitAction } from '@slack/bolt';
import { registerReviewerPayload, CALLBACK_ID as REGISTER_REVIEWER_CALLBACK_ID } from '../payloads/RegisterReviewerPayloads';
import { parseResponse } from '../lib/ResponseParser';
import { CreateReviewerUseCase, CreateReviewerUseCaseOptions } from '../../usecases/CreateReviewerUseCase';
import { Reviewer } from '../../../domain/Entities/Reviewer';

const createReviewerUseCase = new CreateReviewerUseCase(console);

export const register = (app: App) => {

    app.view<ViewSubmitAction>(REGISTER_REVIEWER_CALLBACK_ID, async ({ ack, view, body, client }) => {
        try {
            await ack({ response_action: 'clear' });

            const channel = JSON.parse(view.private_metadata).channel;
            const values = parseResponse(view.state.values);
            const useCaseOptions: CreateReviewerUseCaseOptions = {
                slackId: values.slack_id,
                githubUsername: values.github_username
            };
    
            const reviewer: Reviewer = await createReviewerUseCase.run(useCaseOptions);
    
            client.chat.postMessage({
                channel: channel.id,
                text: `Reviewer registered : \`${reviewer.getGithubUser().getUsername()}\``
            });
        } catch (e) {
            client.chat.postMessage({
                channel: body.user.id,
                text: `There was an error while registering the Reviewer. Error: ${e.message}`
            });
        }
    });

    app.command('/reviewer', async ({ command, ack, body, client, respond }) => {
        await ack();

        const payloadMetadata = {
            channel: {
                id: command.channel_id,
                name: command.channel_name
            }
        };

        switch (command.text) {
            case 'register':
                await client.views.open(registerReviewerPayload(body.trigger_id, payloadMetadata));
                break;
            default:
                respond(`Command not defined. Allowed commands: register`);
                break;
        }
    });
}