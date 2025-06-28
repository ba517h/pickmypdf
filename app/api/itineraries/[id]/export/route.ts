import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the last_exported_at timestamp
    const { error } = await supabase
      .from('itineraries')
      .update({ 
        last_exported_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating export timestamp:', error);
      return NextResponse.json({ error: 'Failed to update export timestamp' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/itineraries/[id]/export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 