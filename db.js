var mysql2 = require("mysql2");
var SSH2Client = require("ssh2").Client;

var sshConf = {
  host: "192.168.101.74",
  port: 22,
  username: "trainee",
  password: "Tr@inee2021",
};
var sqlConf = {
  user: "root",
  password: "Tr@inee2021",
  database: "testDB",
  timeout: 100000,
};

var ssh = new SSH2Client();

var db = null;
ssh.on("ready", function () {
  ssh.forwardOut(
    // source IP the connection would have came from. this can be anything since we
    // are connecting in-process
    "127.0.0.1",
    // source port. again this can be randomized and technically should be unique
    24000,
    // destination IP on the remote server
    "127.0.0.1",
    // destination port at the destination IP
    3306,
    function (err, stream) {
      // you will probably want to handle this better,
      // in case the tunnel couldn't be created due to server restrictions
      if (err) throw err;

      // if you use `sqlConf` elsewhere, be aware that the following will
      // mutate that object by adding the stream object for simplification purposes
      sqlConf.stream = stream;
      db = mysql2.createConnection(sqlConf);
      // now use `db` to make your queries
      db.query(`SELECT * FROM test`, function (error, results, fields) {
        if (error) {
          console.log("ERROR ", error);
          return;
        }
        console.log(results);
        // res.send(results);
      });
    }
  );
});
ssh.connect(sshConf);
