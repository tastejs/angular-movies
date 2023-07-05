export function getArgv(propName) {
  return process.argv.find((i) => i.includes(`--${propName}`))?.split(/[=]/).pop() || '';
}

export function setupArgv(name, cbs) {
  if (!name) {
    throw new Error(cbs?.error() || `Param ${name} not given`);
  }

  if (cbs?.success) {
    console.log(cbs.success(name));
  }


}
