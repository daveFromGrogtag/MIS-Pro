// Yes... I understand that this is stupid. I'm sorry, to future me or whomever else stumbles across this.
if (!Promise.withResolvers) {
    Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }