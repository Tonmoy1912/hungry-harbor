const SEMAPHORE_DISABLE=true;

export default class Semaphore {
  constructor(maxConcurrency, timeout) {
    if (maxConcurrency <= 0) {
      throw new Error('maxConcurrency must be greater than 0');
    }
    this.maxConcurrency = maxConcurrency;
    this.timeout = (timeout || 10 * 60) * 1000; // default timeout 10 minutes
    this.currentCount = 0;
    this.queue = [];
  }

  // Acquire a permit. Resolves to true when a slot is available.
  // If the timeout is reached before a slot is available, resolves to false.
  acquire() {
    return new Promise((resolve) => {
      if(SEMAPHORE_DISABLE){
        return resolve(true);
      }

      if (this.currentCount < this.maxConcurrency) {
        this.currentCount++;
        resolve(true);
      } else {
        const object = { next: resolve, timeoutId: null };
        object.timeoutId = setTimeout(() => {
          const idx = this.queue.indexOf(object);
          if (idx !== -1) this.queue.splice(idx, 1);
          resolve(false);
        }, this.timeout);

        this.queue.push(object);
      }
    });
  }

  // Release a permit, waking up the next waiter (if any).
  release() {
    if(SEMAPHORE_DISABLE){
      return ;
    }

    if (this.queue.length > 0) {
      const { next, timeoutId } = this.queue.shift();
      clearTimeout(timeoutId);
      next(true);
    } else {
      this.currentCount = Math.max(0, this.currentCount - 1);
    }
  }
}