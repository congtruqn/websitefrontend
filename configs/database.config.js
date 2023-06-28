const { createTunnel } = require("tunnel-ssh");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
const tunnelOptions = {
  autoClose: true,
};
const serverOptions = {
  port: 27017,
};
const sshOptions = {
  host: process.env.DB_URL,
  port: 22,
  username: "root",
  password: process.env.SSH_PASS,
};
const forwardOptions = {
  srcAddr: "0.0.0.0",
  srcPort: 27017,
  dstAddr: "127.0.0.1",
  dstPort: 27017,
};

class databaseConnect {
  constructor() {}
  async initialize() {
    let [server, conn] = await createTunnel(
      tunnelOptions,
      serverOptions,
      sshOptions,
      forwardOptions
    );
    this.server = server;
    this.conn = conn;
  }
  async create() {
    await this.initialize()
    if (process.env.NODE_ENV && process.env.NODE_ENV == "development") {
      this.server.on("connection", (connection) => {
        console.log("new connection");
      });
      mongoose.connect(`mongodb://localhost/${process.env.WEBSITE_DB_NAME}`);
    } else {
      const options = {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        useNewUrlParser: true,
      };
      mongoose.connect("mongodb://" + process.env.DB_URL + "/website", options);
    }
    return this.conn;
  }
  async closeConnection() {
    if (process.env.NODE_ENV && process.env.NODE_ENV == "development") {
      //mongoose.disconnect();
      this.server.close()
    } else {
      mongoose.close(() => {
        console.info("closed db connection");
      });
      console.log(this.server.close())
    }
    return this.conn;
  }
}
module.exports = {
  databaseConnect,
};
