import jwt from "jsonwebtoken";

export default function authenticateToken(req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.unauthorized();

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: Error, user: any) => {
      if (err) return res.sendStatus(403);

      console.log(user);

      req.user = user;

      next();
    }
  );
}
