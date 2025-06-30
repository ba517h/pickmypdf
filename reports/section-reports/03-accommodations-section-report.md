# Accommodations Section Report

## Section Overview
- **Section ID**: `accommodations`
- **Display Name**: Accommodations
- **Description**: Hotels and stays
- **Icon**: Star
- **Step Number**: 3
- **Component**: `components/itinerary/accommodations-step.tsx`

## Form Elements

### 1. Add Hotel System
- **Field Type**: Text Input + Add Button
- **Data Point**: `hotels` (Array<{name: string, image?: string}>)
- **Placeholder**: "e.g., Marriott Bangkok, Grand Hyatt Singapore"
- **Features**:
  - Dynamic hotel addition
  - Duplicate prevention
  - Enter key support
  - Auto-clear input after adding

### 2. Hotel Cards Display
- **Layout**: Individual cards per hotel
- **Features**:
  - Compact image input (28px width)
  - Hotel name display
  - Star rating display (5 stars)
  - "Luxury Hotel" designation
  - Generic description
  - Remove functionality

## Data Structure

### TypeScript Interface
```typescript
interface AccommodationsData {
  hotels: Array<{
    name: string;
    image?: string;
  }>;
}
```

## User Interactions

### Adding Hotels
1. **Type hotel name** in input field
2. **Press Enter** or **click Add button**
3. **Hotel added** to array if not duplicate
4. **Input field cleared** automatically

### Managing Hotel Images
- **ImageInput** with `compact={true}` prop
- **Keywords**: `${hotel.name} ${data.destination || ''} hotel accommodation luxury`
- **Placeholder**: Hotel name as placeholder
- **Size**: Fixed 28px width for thumbnail display

### Removing Hotels
- **Remove button**: X icon in top-right of card
- **Confirmation**: Direct removal (no confirmation dialog)
- **Array update**: Filters out removed hotel

## Visual Design

### Add Hotel Card
- **Header**: "Add Hotel" with Plus icon
- **Content**: Input field with Add button
- **Styling**: Standard card with border

### Hotel Cards Layout
- **Individual cards**: Border with gray-200
- **Horizontal layout**: Image + content side-by-side
- **Gap**: 4-unit gap between image and content
- **Responsive**: Maintains layout on mobile

### Hotel Card Content
- **Hotel name**: Medium weight, base size, gray-900
- **Star rating**: 5 yellow stars (filled)
- **Type label**: "Luxury Hotel" in small gray text
- **Description**: "Premium accommodation with excellent amenities"
- **Remove button**: Ghost variant, hover shows destructive color

### Empty State
- **Dashed border**: 2px gray-300 dashed border
- **Centered content**: Star icon, heading, description
- **Icon**: Large star (12x12) in gray-400
- **Message**: "No hotels added yet" with helpful description

## Component Features

### Image Integration
```typescript
<ImageInput
  value={hotel.image}
  onChange={(imageUrl) => updateHotelImage(hotel.name, imageUrl)}
  keywords={`${hotel.name} ${data.destination || ''} hotel accommodation luxury`}
  placeholder={`${hotel.name}`}
  className="w-full"
  compact={true}
/>
```

### Star Rating Display
```typescript
{[...Array(5)].map((_, i) => (
  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
))}
```

## Helper Functions

### Hotel Management
```typescript
const addHotel = () => {
  if (newHotel.trim()) {
    const existingHotels = data.hotels || [];
    if (!existingHotels.some(hotel => hotel.name === newHotel.trim())) {
      const updatedHotels = [...existingHotels, { name: newHotel.trim(), image: "" }];
      onUpdate({ hotels: updatedHotels });
      setNewHotel("");
    }
  }
};

const removeHotel = (nameToRemove: string) => {
  const updatedHotels = (data.hotels || []).filter(hotel => hotel.name !== nameToRemove);
  onUpdate({ hotels: updatedHotels });
};

const updateHotelImage = (name: string, imageUrl: string) => {
  const updatedHotels = (data.hotels || []).map(hotel =>
    hotel.name === name ? { ...hotel, image: imageUrl } : hotel
  );
  onUpdate({ hotels: updatedHotels });
};
```

## State Management
- **Local state**: `newHotel` (string) for input field
- **Array operations**: Add, remove, update via parent callback
- **Image state**: Managed by individual ImageInput components

## Validation Rules
- **Hotel names**: 
  - Required (minimum 1 character after trim)
  - No duplicates allowed
  - Case-sensitive comparison
- **Images**: Optional for each hotel
- **Array**: No minimum or maximum limits

## Component Props
```typescript
interface AccommodationsStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}
```

## Error Handling
- **Duplicate prevention**: Checks existing hotel names
- **Empty input handling**: Requires non-empty hotel name
- **Array safety**: Handles undefined hotels array
- **Image failures**: Handled by ImageInput component

## Accessibility
- **Form labels**: Proper labeling for image inputs
- **Keyboard support**: Enter key for adding hotels
- **Button states**: Add button disabled when input empty
- **Focus management**: Input gets focus after adding
- **Screen readers**: Descriptive button text

## Dependencies
- **React**: useState hook for local state
- **React Hook Form**: Form integration
- **Lucide React**: Icons (X, Plus, Star)
- **UI Components**: Input, Label, Button, Card
- **ImageInput**: Custom image upload with compact mode

## Performance Considerations
- **Array operations**: O(n) for duplicate checking
- **Image loading**: Compact mode for faster loading
- **State updates**: Minimal re-renders with targeted updates
- **Memory usage**: Image URLs stored as strings

## Integration Points
- **Parent form**: Data flows via `onUpdate` callback
- **PDF generation**: Hotel images appear in accommodations section
- **Image search**: Auto-generated keywords include destination
- **Form validation**: Required field validation on submit

## User Experience Features
- **Immediate feedback**: Hotels appear immediately when added
- **Visual hierarchy**: Clear distinction between add area and hotel list
- **Count display**: Shows number of hotels in section header
- **Responsive images**: Compact mode prevents layout breaking
- **Empty state guidance**: Helpful messaging when no hotels added

## Business Logic
- **Default styling**: All hotels shown as "Luxury Hotel" with 5 stars
- **Generic description**: Consistent messaging across all hotels
- **Image keywords**: Include "luxury" and "accommodation" terms
- **Visual consistency**: Uniform card design across all hotels 