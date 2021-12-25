import { App, } from '@slack/bolt';
import { config } from 'dotenv';
import { register as registerChallengeCommand } from './commands/ChallengeCommand';
import { register as registerReviewerCommand } from './commands/ReviewerCommand';
import { buildManifest } from './manifest';

config();

const app = new App({
    token: process.env.SLACK_XOXB_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    //logLevel: LogLevel.DEBUG,
});

// register the app
app.client.apps.manifest.create(
    process.env.SLACK_XOXP_TOKEN,
    buildManifest(process.env)
);

registerChallengeCommand(app);
registerReviewerCommand(app);


(async () => {
    const port = parseInt(process.env.SLACK_CC_APP_LOCAL_PORT || '') || 3000;
    await app.start(port);

    console.log(`⚡️ Bolt app is running and listening on port ${port}!`);
})();