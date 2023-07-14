import Bottleneck from 'bottleneck';

interface PullQueueProps {
  interval: number;
  maxRetries: number;
}

/**
 * A queue for running limited number of jobs with an interval
 */
export class PullQueue extends Bottleneck {
  /**
   * Pull queue constructor
   * @param {PullQueueProps} options queue instance configuration
   */
  constructor(options: PullQueueProps) {
    super({
      minTime: options.interval,
      maxConcurrent: 1,
    });

    this.on('failed', async (_, jobInfo) => {
      if (jobInfo.retryCount < options.maxRetries - 1) {
        return options.interval;
      }
    });
  }

  /**
   * Adds a job to be running a specific number of times with an interval and starts it
   * @param {() => PromiseLike<unknown>} job a function to run
   * @returns {Promise<unknown>}
   */
  pushJob(job: () => PromiseLike<unknown>): Promise<unknown> {
    return this.schedule(job);
  }
}
