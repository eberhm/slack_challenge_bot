import { ViewsOpenArguments } from "@slack/web-api";
import { Challenge } from "../../../domain/Entities/Challenge";

export const CALLBACK_ID = "send_candidate_challenge";
export const sendChallengePayload = (triggerId, challenges: Challenge[], metadata: Object): ViewsOpenArguments => {
	return {
		"trigger_id": triggerId,
		"view": {
			"type": "modal",
			"private_metadata": JSON.stringify(metadata),
			"callback_id": CALLBACK_ID,
			"title": {
				"type": "plain_text",
				"text": "Send Code Challenge"
			},
			"blocks": [
				{
					"type": "section",
					"text": {
						"type": "mrkdwn",
						"text": "Send a registered Code Challenge to a candidate"
					}
				},
				{
					"type": "divider"
				},
				{
					"type": "input",
					"element": {
						"type": "static_select",
						"placeholder": {
							"type": "plain_text",
							"text": "Select Code Challenge",
							"emoji": true
						},
						"options": challenges.map(challenge => (
							{
								"text": {
									"type": "plain_text",
									"text": challenge.getName(),
									"emoji": true
								},
								"value": challenge.getName()	
							})),
						"action_id": "challenge_name"
					},
					"label": {
						"type": "plain_text",
						"text": "Code Challenge",
						"emoji": true
					}
				},
				{
					"type": "header",
					"text": {
						"type": "plain_text",
						"text": "Candidate Details",
						"emoji": true
					}
				},
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "candidate_name"
					},
					"label": {
						"type": "plain_text",
						"text": "Candidate name"
					}
				},
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "candidate_github_username"
					},
					"label": {
						"type": "plain_text",
						"text": "Candidate github username"
					}
				},
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "candidate_resume_url"
					},
					"label": {
						"type": "plain_text",
						"text": "Candidate Resume URL"
					}
				},
				{
					"type": "header",
					"text": {
						"type": "plain_text",
						"text": "Reviewers",
						"emoji": true
					}
				},
				{
					"type": "input",
					"element": {
						"type": "users_select",
						"placeholder": {
							"type": "plain_text",
							"text": "Select user",
							"emoji": true
						},
						"action_id": "reviewer1"
					},
					"label": {
						"type": "plain_text",
						"text": "Select Reviewer 1",
						"emoji": true
					}
				},
				{
					"type": "input",
					"element": {
						"type": "users_select",
						"placeholder": {
							"type": "plain_text",
							"text": "Select user",
							"emoji": true
						},
						"action_id": "reviewer2"
					},
					"label": {
						"type": "plain_text",
						"text": "Select Reviewer 2",
						"emoji": true
					}
				}
			],
			"submit": {
				"type": 'plain_text',
				"text": 'Send'
			}
		}
	}
};