import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"
          role="alert"
        >
          <h1 className="text-lg font-semibold text-slate-800 md:text-2xl">
            Ops, algo deu errado na interface. Atualize a página.
          </h1>
        </div>
      );
    }

    return this.props.children;
  }
}
