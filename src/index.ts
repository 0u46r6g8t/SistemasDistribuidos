import server from "./config/server";
import sockets from "./connection";
import * as dotenv from "dotenv";

dotenv.config();
sockets.map((connection) => {
  connection;
});

server.server.listen(3005);
