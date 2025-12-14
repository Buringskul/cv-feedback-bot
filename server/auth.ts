import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import type { Request, Response, NextFunction } from "express";
import "dotenv/config";


const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID!;
const ISSUER = `https://${SUPABASE_PROJECT_ID}.supabase.co/auth/v1`;

const client = jwksClient({
  jwksUri: `${ISSUER}/keys`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 10 * 60 * 1000,
});

function getKey(header: JwtHeader, cb: SigningKeyCallback) {
  client.getSigningKey(header.kid!, (err, key: any) => {
    cb(err, key?.getPublicKey());
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "missing token" });

  jwt.verify(
    token,
    getKey,
    { algorithms: ["RS256"], issuer: ISSUER, audience: "authenticated" },
    (err, decoded) => {
      if (err) return res.status(401).json({ error: "invalid token" });
      (req as any).user = decoded; // contains sub, email, etc.
      next();
    }
  );
}