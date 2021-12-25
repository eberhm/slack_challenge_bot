import { App } from '@slack/bolt';
import { config } from 'dotenv';
import { buildManifest } from './manifest';

config();

const client = new WebClient({
    token: process.env.SLACK_XOXB_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    //logLevel: LogLevel.DEBUG,
});

client.apps.manifests.update(
    process.env.SLACK_XOXP_TOKEN,
    buildManifest(process.env)
);