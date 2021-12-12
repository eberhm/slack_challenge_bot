#!/usr/bin/env ts-node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir('commands', {
    extensions: ['ts'],
  })
  // Enable strict mode.
  .strict()
  .demandCommand()
  // Useful aliases.
  .alias({ h: 'help' })
  .argv;

  