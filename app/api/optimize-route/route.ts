import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Stop {
  jobId: string;
  clientName: string;
  lat: number;
  lng: number;
  scheduledAt: string;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Nearest-neighbor route ordering. This is a deterministic heuristic placeholder —
// swap it for a real solver (OR-Tools, a routing API, or an LLM-assisted planner)
// once the crew/job volume justifies it.
function nearestNeighborOrder(stops: Stop[]): Stop[] {
  if (stops.length <= 2) return stops;

  const remaining = [...stops];
  const ordered: Stop[] = [remaining.shift()!];

  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    remaining.forEach((stop, index) => {
      const distance = haversineKm(last, stop);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    ordered.push(remaining.splice(nearestIndex, 1)[0]);
  }

  return ordered;
}

export async function POST(request: Request) {
  const { crewId, date } = await request.json();

  if (!crewId || !date) {
    return NextResponse.json({ error: 'crewId y date son requeridos' }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from('business_members')
    .select('business_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) {
    return NextResponse.json({ error: 'Completa el registro de tu negocio primero.' }, { status: 403 });
  }

  // Belt-and-suspenders check on top of RLS: make sure the crew actually
  // belongs to the caller's business before optimizing anything for it.
  const { data: crew } = await supabase
    .from('crews')
    .select('id')
    .eq('id', crewId)
    .eq('business_id', membership.business_id)
    .maybeSingle();
  if (!crew) {
    return NextResponse.json({ error: 'Cuadrilla inválida.' }, { status: 404 });
  }

  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59`);

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, scheduled_at, clients(name, lat, lng)')
    .eq('crew_id', crewId)
    .eq('business_id', membership.business_id)
    .gte('scheduled_at', startOfDay.toISOString())
    .lte('scheduled_at', endOfDay.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type JobWithClient = {
    id: string;
    scheduled_at: string;
    clients: { name: string; lat: number | null; lng: number | null } | null;
  };

  const stops: Stop[] = ((jobs ?? []) as unknown as JobWithClient[])
    .filter((job) => job.clients?.lat != null && job.clients?.lng != null)
    .map((job) => ({
      jobId: job.id,
      clientName: job.clients!.name,
      lat: job.clients!.lat!,
      lng: job.clients!.lng!,
      scheduledAt: job.scheduled_at,
    }));

  const skipped = (jobs?.length ?? 0) - stops.length;
  const orderedStops = nearestNeighborOrder(stops);

  let totalKm = 0;
  for (let i = 0; i < orderedStops.length - 1; i++) {
    totalKm += haversineKm(orderedStops[i], orderedStops[i + 1]);
  }

  return NextResponse.json({
    crewId,
    date,
    stops: orderedStops,
    totalDistanceKm: Number(totalKm.toFixed(2)),
    skippedJobsMissingCoordinates: skipped,
  });
}
