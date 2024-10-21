module.exports = {
    apps: [
      {
        name: "server",
        script: "ts-node",
        args: "-r tsconfig-paths/register /home/ubuntu/Persual/backend/src/server.ts",
        watch: true,
        interpreter: "none", 
      },
    ],
  };
  