/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from 'lucide-react';
import { DEFAULT_LOGO_URL } from '../data/communityData';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-lg w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-sm">
            {/* Header Emblem */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-slate-700/50 border border-slate-600 p-2 flex items-center justify-center shadow-lg">
                  <img
                    src={DEFAULT_LOGO_URL}
                    alt="Bote Youth Community Nepal"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-500 rounded-full border-2 border-slate-800 flex items-center justify-center shadow">
                  <AlertTriangle className="w-4 h-4 text-slate-950 font-bold" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-red-950/70 text-red-300 border border-red-800/60 inline-block">
                Auto-Recovery Protected
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-poppins">
                Application Recovered from an Error
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                The portal encountered a temporary rendering exception. Your saved records, memberships, and community configurations remain safe and intact.
              </p>
            </div>

            {/* Collapsible Technical Details */}
            {this.state.error && (
              <div className="text-left bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs font-mono text-red-300 max-h-36 overflow-y-auto space-y-1">
                <div className="font-bold text-amber-300">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <div className="text-[10px] text-slate-500 whitespace-pre-wrap">
                    {this.state.error.stack.split('\n').slice(0, 4).join('\n')}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full bg-[#003893] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full bg-[#DC143C] hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bote Youth Community Nepal &bull; Cloud Resilience Active</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
