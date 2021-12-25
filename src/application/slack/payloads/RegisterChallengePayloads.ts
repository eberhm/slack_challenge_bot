import { ViewsOpenArguments } from "@slack/web-api";
import { Challenge } from "../../../domain/Entities/Challenge";

export const CALLBACK_ID = 'register_challenge';
export const registerChallengePayload = (triggerId, metadata = {}): ViewsOpenArguments => ({
	"trigger_id": triggerId,
	"view": {
		"type": "modal",
		"private_metadata": JSON.stringify(metadata),
		"callback_id": CALLBACK_ID,
		"title": {
			"type": "plain_text",
			"text": "Register Code Challenge"
		},
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "Register a new <https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository|Github Repository Template> as Code Challenge to send to your candidates."
				}
			},
			{
				"type": "divider"
			},
			{
				"type": "input",
				"element": {
					"type": "plain_text_input",
					"action_id": "code_challenge_name"
				},
				"label": {
					"type": "plain_text",
					"text": "Code Challenge Name"
				}
			},
			{
				"type": "input",
				"dispatch_action": true,
				"element": {
					"type": "plain_text_input",
					"action_id": "github_repo_url"
				},
				"label": {
					"type": "plain_text",
					"text": "Github Repository URL"
				}
			}
		],
		submit: {
			type: 'plain_text',
			text: 'Register'
		}
	}
});

export const registerChallengeSuccessResponse = (challenge: Challenge) => {
	return [
			{
				"type": "context",
				"elements": [
					{
						"type": "mrkdwn",
						"text": `:rocket: Challenge <${challenge.getUrl()}|${challenge.getName()}> created successfully!`
					}
				]
			}
		];
} 