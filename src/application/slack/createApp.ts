import { App, } from '@slack/bolt';
import { config } from 'dotenv';
import { buildManifest } from './manifest';

config();

const app = new App({
    token: process.env.SLACK_XOXB_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    //logLevel: LogLevel.DEBUG,
});

const apps: any = app.client.apps;
// register the app
apps.manifest.create(
    process.env.SLACK_XOXP_TOKEN,
    buildManifest(process.env)
);