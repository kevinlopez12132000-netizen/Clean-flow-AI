'use client';

import { useState } from 'react';

interface Crew {
  id: string;
  name: string;
}

interface Stop {
  jobId: string;
  clientName: string;
  scheduledAt: string;
}

export function RouteOptimizer({ crews }: { crews: Crew[] }) {
  const [crewId, setCrewId] = useState(crews[0]?.id ?? '');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ stops: Stop[]; totalDistanceKm: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOptimize() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crewId, date }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Error al optimizar la ruta');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="font-medium">Optimizar ruta del día</h2>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-sm">
          Cuadrilla
          <select
            className="mt-1 rounded-md border border-slate-300 px-2 py-1"
            value={crewId}
            onChange={(e) => setCrewId(e.target.value)}
          >
            {crews.map((crew) => (
              <option key={crew.id} value={crew.id}>
                {crew.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Fecha
          <input
            type="date"
            className="mt-1 rounded-md border border-slate-300 px-2 py-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button
          onClick={handleOptimize}
          disabled={!crewId || loading}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Calculando…' : 'Optimizar'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-slate-500">
            Distancia estimada: <strong>{result.totalDistanceKm} km</strong>
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {result.stops.map((stop) => (
              <li key={stop.jobId}>{stop.clientName}</li>
            ))}
            {result.stops.length === 0 && (
              <p className="text-slate-400">
                No hay trabajos con coordenadas para esa cuadrilla y fecha.
              </p>
            )}
          </ol>
        </div>
      )}
    </div>
  );
}
