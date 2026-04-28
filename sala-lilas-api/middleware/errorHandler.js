function errorHandler(err, req, res, next) {
  const isSyntaxError =
    err instanceof SyntaxError &&
    typeof err.status === "number" &&
    "body" in err;

  if (isSyntaxError) {
    return res.status(400).json({
      sucesso: false,
      dados: null,
      mensagem: "JSON de requisicao invalido."
    });
  }

  const isDatabaseError =
    err &&
    (err.code ||
      err.sqlState ||
      err.errno ||
      err.name === "SequelizeDatabaseError");

  if (isDatabaseError) {
    return res.status(500).json({
      sucesso: false,
      dados: null,
      mensagem: "Erro interno de processamento."
    });
  }

  const statusCode =
    Number.isInteger(err?.statusCode) && err.statusCode >= 400
      ? err.statusCode
      : 500;

  const genericMessage =
    statusCode >= 500
      ? "Erro interno de processamento."
      : "Nao foi possivel processar a requisicao.";

  return res.status(statusCode).json({
    sucesso: false,
    dados: null,
    mensagem: genericMessage
  });
}

module.exports = errorHandler;
