export function getLog(verbose: boolean = false) {
  return (...logs: any[]) => {
    if (verbose) {
      console.log(...logs);
    }
  }
}

export function getArgv(propertyName: string): string {
  return (
      process.argv
          .find((index: string) => index.includes(`--${propertyName}`))
          ?.split(/[ =]/)
          .pop() || ''
  );
}
