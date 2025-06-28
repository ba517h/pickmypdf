import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  UpdateItinerarySchema,
  ItineraryResponseSchema 
} from '@/lib/schemas';

export async function GET(
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

    // Fetch the specific itinerary
    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
      }
      console.error('Error fetching itinerary:', error);
      return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
    }

    // Validate response
    const validatedResponse = ItineraryResponseSchema.parse(itinerary);
    
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('GET /api/itineraries/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateItinerarySchema.parse({ ...body, id });

    // Update the itinerary
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (validatedData.title) {
      updateData.title = validatedData.title;
    }

    if (validatedData.form_data) {
      updateData.form_data = validatedData.form_data;
    }

    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
      }
      console.error('Error updating itinerary:', error);
      return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 });
    }

    // Validate response
    const validatedResponse = ItineraryResponseSchema.parse(itinerary);
    
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('PUT /api/itineraries/[id] error:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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

    // Delete the itinerary
    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting itinerary:', error);
      return NextResponse.json({ error: 'Failed to delete itinerary' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/itineraries/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 