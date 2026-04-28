const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Acesso negado. Token não fornecido.",
      dados: null
    });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    const configError = new Error("JWT_SECRET não configurado.");
    configError.statusCode = 500;
    return next(configError);
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.usuario = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Sessão inválida ou expirada.",
      dados: null
    });
  }
}

module.exports = authMiddleware;
