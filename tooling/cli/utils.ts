import * as yargs from 'yargs';

export function getCliParam<T = string>(names: string[]): T | false {
  // @TODO move  cli stuff into separate task
  // Check for tag params from cli command
  const params = Object.keys(yargs.argv)
    .filter((k) => names.includes(k))
    .map((k) => (yargs.argv as Record<string, any>)[k].toString().trim())
    .filter((p) => !!p);
  return params.length ? params.pop() : false;
}
