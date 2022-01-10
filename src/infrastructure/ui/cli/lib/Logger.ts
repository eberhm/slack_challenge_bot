export class Logger {
    public info = process.stdout.write;
    public log = process.stdout.write;
    public error = process.stderr.write;
  }