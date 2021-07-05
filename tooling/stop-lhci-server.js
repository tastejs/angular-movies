
const terminate = require('terminate');
const find = require('find-process');




find('port', 9001)
  .then(function (list) {
    if (!list.length) {
      console.log('port 9001 is free now');
    } else {
      console.log(`${list[0].name} is listening port 9001`);
      return terminateProcess(list[0].pid)
    }
  })



function terminateProcess(pid) {
  return new Promise((res, rej) => {
    terminate(pid, function (err) {
      if (err) { // you will get an error if you did not supply a valid process.pid
        console.log("Oopsy: " + err); // handle errors in your preferred way.
        rej(err);
      }
      else {
        console.log(`Process with pid ${pid} terminated`); // terminating the Processes succeeded.
        res();
      }
    });

  })
}
