import { Queue } from "bullmq";
import { redisConnectionOptions } from "./redis";

export const QUEUE_NAME = "question-generation";

let generationQueue: Queue | null = null;

export const getGenerationQueue = (): Queue => {
  if (!generationQueue) {
    generationQueue = new Queue(QUEUE_NAME, {
      connection: redisConnectionOptions,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: {
          count: 100, // Keep last 100 completed jobs
        },
        removeOnFail: {
          count: 50, // Keep last 50 failed jobs
        },
      },
    });

    console.log("✅ BullMQ queue initialized:", QUEUE_NAME);
  }

  return generationQueue;
};
