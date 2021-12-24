import { ViewsOpenArguments } from "@slack/web-api";

export const CALLBACK_ID = "register_reviewer";
export const registerReviewerPayload = (triggerId, metadata: Object): ViewsOpenArguments => {
	return {
		"trigger_id": triggerId,
		"view": {
			"type": "modal",
			"private_metadata": JSON.stringify(metadata),
			"callback_id": CALLBACK_ID,
			"title": {
				"type": "plain_text",
				"text": "Register Reviewer"
			},
			"blocks": [
				{
					"type": "section",
					"text": {
						"type": "plain_text",
						"text": "Register a new team member as reviewer for candidate code challenges.",
						"emoji": true
					}
				},
				{
					"type": "input",
					"element": {
						"type": "users_select",
						"placeholder": {
							"type": "plain_text",
							"text": "Select reviewer",
							"emoji": true
						},
						"action_id": "slack_id"
					},
					"label": {
						"type": "plain_text",
						"text": "Reviewer",
						"emoji": true
					}
				},
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "github_username"
					},
					"label": {
						"type": "plain_text",
						"text": "Github username",
						"emoji": true
					}
				}
			],
			"submit": {
				"type": 'plain_text',
				"text": 'Register Reviewer'
			}
		}
	}
};