import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  CreateItinerarySchema, 
  ItinerariesListResponseSchema,
  ItineraryResponseSchema 
} from '@/lib/schemas';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's itineraries (without full form_data for performance)
    const { data: itineraries, error } = await supabase
      .from('itineraries')
      .select('id, title, created_at, updated_at, last_exported_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching itineraries:', error);
      return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
    }

    // Validate response
    const validatedData = ItinerariesListResponseSchema.parse(itineraries || []);
    
    return NextResponse.json(validatedData);
  } catch (error) {
    console.error('GET /api/itineraries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateItinerarySchema.parse(body);

    // Create new itinerary
    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .insert({
        user_id: user.id,
        title: validatedData.title,
        form_data: validatedData.form_data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating itinerary:', error);
      return NextResponse.json({ error: 'Failed to create itinerary' }, { status: 500 });
    }

    // Validate response
    const validatedResponse = ItineraryResponseSchema.parse(itinerary);
    
    return NextResponse.json(validatedResponse, { status: 201 });
  } catch (error) {
    console.error('POST /api/itineraries error:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 