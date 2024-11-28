import { app } from "./app";
import { PORT } from "./commons/utils/config";

app.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
    throw new Error(error.message);
});