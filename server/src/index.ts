import config from "./config";
import app from "./app";

app.listen(config.port, () => {
  console.log(`app started at http://localhost:${config.port}`);
});
