import { createServer } from "./app";

const port = Number(process.env.PORT ?? 3333);

async function bootstrap() {
  const app = await createServer();

  await app.listen({
    port,
    host: "0.0.0.0"
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
