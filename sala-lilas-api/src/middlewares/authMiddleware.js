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
    req.usuarioId = decoded.sub;
    console.log("[authMiddleware] Token verificado - usuarioId:", req.usuarioId, "email:", decoded.email);
    return next();
  } catch (error) {
    console.error("[authMiddleware] Erro ao verificar token:", error.message);
    return res.status(401).json({
      sucesso: false,
      mensagem: "Sessão inválida ou expirada.",
      dados: null
    });
  }
}

function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.usuario || !allowedRoles.includes(req.usuario.perfil)) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Acesso negado. Seu perfil não tem permissão.",
        dados: null
      });
    }

    return next();
  };
}

module.exports = {
  authMiddleware,
  checkRole
};
