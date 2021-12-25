export const buildManifest = (env) =>({
    "_metadata": {
        "major_version": 1,
        "minor_version": 1
    },
    "display_information": {
        "name": "github-code-challenges"
    },
    "features": {
        "bot_user": {
            "display_name": "github-code-challenges",
            "always_online": true
        },
        "slash_commands": [
            {
                "command": "/challenge",
                "url": env.SLACK_BOLT_EVENTS_URL,
                "description": "Registers/sends a new code challenge",
                "usage_hint": "[send register]",
                "should_escape": false
            },
            {
                "command": "/reviewer",
                "url": env.SLACK_BOLT_EVENTS_URL,
                "description": "actions on reviewers",
                "usage_hint": "[ register ]",
                "should_escape": false
            }
        ]
    },
    "oauth_config": {
        "scopes": {
            "bot": [
                "chat:write",
                "commands"
            ]
        }
    },
    "settings": {
        "interactivity": {
            "is_enabled": true,
            "request_url": env.SLACK_BOLT_EVENTS_URL
        },
        "org_deploy_enabled": false,
        "socket_mode_enabled": false,
        "token_rotation_enabled": false
    }
})