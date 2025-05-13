import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "../__generated__/db/index";

export const createDb = (connectionString: string) => {
  return new Kysely<DB>({
    log(event): void {
      if (event.level === "query") {
        console.debug(event.query.sql);
        console.debug(event.query.parameters);
        console.debug(`Query took ${event.queryDurationMillis} ms`);
      } else {
        // console.error(event.error);
        console.error("Query failed : ", {
          durationMs: event.queryDurationMillis,
          error: event.error,
          sql: event.query.sql,
          params: event.query.parameters,
        });
      }
    },
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
  });
};
