import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="max-w-lg rounded-[28px] bg-white p-8 text-center shadow-lift">
            <h1 className="font-display text-3xl text-slate-900">Something went wrong</h1>
            <p className="mt-3 text-slate-500">
              The page hit an unexpected error. Refresh and try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
