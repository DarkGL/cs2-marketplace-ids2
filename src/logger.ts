import pinoPretty from 'pino-pretty';
import type { BaseLogger } from 'pino';
import pino from 'pino';

export { logger };
export type { Logger };

type Logger = BaseLogger & {
    child: (bindings: pino.Bindings) => Logger;
};

const logLevel = process.env.LOG_LEVEL ?? 'info';

const logger = pino(
              {
                  level: logLevel,
              },
              pinoPretty({
                  levelFirst: true,
                  colorize: true,
                  translateTime: 'yyyy-mm-dd HH:MM:ss',
              }),
          );