const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prismaClient");

function sanitizeUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    criadoEm: usuario.criadoEm
  };
}

async function registrarUsuario(req, res, next) {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome, email, senha e perfil sao obrigatorios.",
        dados: null
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Email ja cadastrado.",
        dados: null
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        perfil
      }
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Usuario registrado com sucesso.",
      dados: {
        usuario: sanitizeUsuario(novoUsuario)
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function loginUsuario(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Email e senha sao obrigatorios.",
        dados: null
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Credenciais invalidas.",
        dados: null
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Credenciais invalidas.",
        dados: null
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      const configError = new Error("JWT_SECRET nao configurado.");
      configError.statusCode = 500;
      throw configError;
    }

    const token = jwt.sign(
      {
        sub: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil
      },
      secret,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      sucesso: true,
      mensagem: "Login realizado com sucesso.",
      dados: {
        token,
        usuario: sanitizeUsuario(usuario)
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  registrarUsuario,
  loginUsuario
};
