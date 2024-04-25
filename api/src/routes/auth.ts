import axios from "axios";

import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function authRoutes(app: FastifyInstance){
  
  // Cadastrando usuário
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/register', { 
    schema: {
      body: z.object({
        code: z.string()
      })
    }
   }, async (request) => {
    const { code } = request.body;

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json'
        }
      }
    );

    const { access_token } = accessTokenResponse.data;

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const authSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url()
    });

    console.log(authSchema)

    const userInfo = authSchema.parse(userResponse.data);

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id
      }
    });

    if(!user){
      await prisma.user.create({
        data: {
          name: userInfo.name,
          githubId: userInfo.id,
          login: userInfo.login,
          avatarURL: userInfo.avatar_url
        }
      })
    }

    let token = app.jwt.sign(
      {
        name: user?.name,
        avatarUrl: user?.avatarURL
      },
      {
        sub: user?.id,
        expiresIn: '30 days'
      }
    );

    return { token }
  });
}