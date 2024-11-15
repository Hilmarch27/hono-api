import { Hono } from "hono";
import { cors } from 'hono/cors'
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { userController } from "./controller/user.controller";
import { decodedToken } from "./middleware/auth.middleware";
import { routerController } from "./controller/router.controller";


// Create the Hono app with proper typing
const app = new Hono()

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173', // Gunakan origin spesifik, bukan wildcard
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 3600
  })
)


app.get("/", (c) => {
  return c.text("Hello brother!");
});

app.use(decodedToken)

app.route('/', userController)
app.route('/', routerController)

app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json({
      errors: err.message,
    });
  } else if (err instanceof ZodError) {
    c.status(400);
    return c.json({
      errors: err.message,
    });
  } else {
    c.status(500);
    return c.json({
      errors: err.message,
    });
  }
});



export default {
  port: 3007,
  fetch: app.fetch
} 
