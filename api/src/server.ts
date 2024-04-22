import 'dotenv/config'

import fastify from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { authRoutes } from "./routes/auth";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { operationRoutes } from './routes/operations';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(authRoutes);
app.register(operationRoutes);

app.register(cors, {
  origin: '*'
});

app.register(jwt, {
  secret: 'S@tUrn2024'
});

app.listen({
  port: 3333
})
.then(() => console.log("HTTP Server Running!"))