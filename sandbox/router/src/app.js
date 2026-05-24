import express from "express"
import morgan from "morgan";

const app = express()
app.use(morgan("combined"));

app.use((req, res, next) => {
    const host = req.headers.host;
    const sandboxId = host.split(".")[0];

    const target = `http://sandbox-service-${sandboxId}`;

    return createProxyMiddleware({
        target,
        changeOrigin: true,
        ws: true,
    })(req, res, next);
})
export default app