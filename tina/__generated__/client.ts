import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '232cac03e9cdcdff783c1b871abdf5c1b1d7effa', queries,  });
export default client;
  