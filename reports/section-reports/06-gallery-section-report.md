# Gallery Section Report

## Section Overview
- **Section ID**: `gallery`
- **Display Name**: Gallery
- **Description**: Destination showcase
- **Icon**: Camera
- **Step Number**: 6
- **Component**: `components/itinerary/gallery-step.tsx`

## Form Elements

### 1. Add Gallery Item System
- **Field Type**: Text Input + Add Button
- **Data Point**: `destinationGallery` (Array<{name: string, image?: string, type: "city" | "activity" | "landmark"}>)
- **Placeholder**: "e.g., Oslo Harbor, Northern Lights, Traditional Church"
- **Features**:
  - Dynamic gallery item addition
  - Duplicate prevention
  - Enter key support
  - Auto-clear input after adding

### 2. Gallery Item Cards Display
- **Layout**: Individual cards per gallery item
- **Features**:
  - Compact image input (28px width)
  - Gallery item name display
  - Type selection buttons (city/activity/landmark)
  - Remove functionality

### 3. Quick Start Suggestions
- **Feature**: Auto-populate with default suggestions
- **Condition**: Shows when destination exists but no gallery items
- **Default items**: Based on destination name
- **Button**: "Add Suggestions" for quick setup

## Data Structure

### TypeScript Interface
```typescript
interface GalleryData {
  destinationGallery?: Array<{
    name: string;
    image?: string;
    type: "city" | "activity" | "landmark";
  }>;
}
```

### Default Suggestions Template
```typescript
const defaultItems = [
  { name: `${data.destination} Skyline`, type: "city" as const },
  { name: `Local Markets`, type: "activity" as const },
  { name: `Historic Landmarks`, type: "landmark" as const },
  { name: `Cultural Activities`, type: "activity" as const }
];
```

## User Interactions

### Adding Gallery Items
1. **Type item name** in input field
2. **Press Enter** or **click Add button**
3. **Item added** to array if not duplicate
4. **Input field cleared** automatically
5. **Default type**: "activity" assigned to new items

### Managing Gallery Images
- **ImageInput** with `compact={true}` prop
- **Keywords**: `${item.name} ${data.destination || ''} ${item.type}`
- **Placeholder**: Gallery item name as placeholder
- **Size**: Fixed 28px width for thumbnail display

### Type Selection
- **Three buttons**: city, activity, landmark
- **Visual feedback**: Different styling for selected vs unselected
- **Dynamic keywords**: Type affects image search keywords
- **Immediate update**: Type changes update immediately

### Removing Gallery Items
- **Remove button**: X icon in top-right of card
- **Confirmation**: Direct removal (no confirmation dialog)
- **Array update**: Filters out removed item

## Visual Design

### Quick Start Card
- **Background**: Blue theme (`border-blue-200 bg-blue-50/50`)
- **Content**: Destination-specific suggestions
- **Button**: "Add Suggestions" outline variant
- **Conditional**: Only shows when empty gallery

### Add Gallery Item Card
- **Header**: "Add Gallery Item" with Plus icon
- **Content**: Input field with Add button
- **Styling**: Standard card with border

### Gallery Item Cards Layout
- **Individual cards**: Border with gray-200
- **Horizontal layout**: Image + content side-by-side
- **Gap**: 4-unit gap between image and content
- **Responsive**: Maintains layout on mobile

### Gallery Item Card Content
- **Item name**: Medium weight, small size, truncated text
- **Type buttons**: Three-button group with different states
  - **Selected**: Blue background (`bg-blue-600 text-white border-blue-600`)
  - **Unselected**: Gray background (`bg-gray-100 text-gray-600 border-gray-300`)
  - **Hover**: Gray-200 background for unselected
- **Remove button**: Red theme (`text-red-600 hover:text-red-700`)

### Empty State
- **Dashed border**: 2px gray-300 dashed border
- **Centered content**: Camera icon, heading, description
- **Icon**: Large camera (12x12) in gray-400
- **Message**: "No gallery items added yet" with helpful description

## Component Features

### Image Integration
```typescript
<ImageInput
  value={item.image}
  onChange={(imageUrl) => updateGalleryImage(item.name, imageUrl)}
  keywords={`${item.name} ${data.destination || ''} ${item.type}`}
  placeholder={`${item.name}`}
  className="w-full"
  compact={true}
/>
```

### Type Selection Buttons
```typescript
{["city", "activity", "landmark"].map((type) => (
  <button
    key={type}
    onClick={() => updateGalleryType(item.name, type as any)}
    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
      item.type === type
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
    }`}
  >
    {type}
  </button>
))}
```

## Helper Functions

### Gallery Management
```typescript
const addGalleryItem = () => {
  if (newGalleryItem.trim()) {
    const existingGallery = data.destinationGallery || [];
    if (!existingGallery.some(item => item.name === newGalleryItem.trim())) {
      const updatedGallery = [...existingGallery, { 
        name: newGalleryItem.trim(), 
        image: "",
        type: "activity" as const // default type
      }];
      onUpdate({ destinationGallery: updatedGallery });
      setNewGalleryItem("");
    }
  }
};

const removeGalleryItem = (nameToRemove: string) => {
  const updatedGallery = (data.destinationGallery || []).filter(item => item.name !== nameToRemove);
  onUpdate({ destinationGallery: updatedGallery });
};

const updateGalleryImage = (name: string, imageUrl: string) => {
  const updatedGallery = (data.destinationGallery || []).map(item =>
    item.name === name ? { ...item, image: imageUrl } : item
  );
  onUpdate({ destinationGallery: updatedGallery });
};

const updateGalleryType = (name: string, type: "city" | "activity" | "landmark") => {
  const updatedGallery = (data.destinationGallery || []).map(item =>
    item.name === name ? { ...item, type } : item
  );
  onUpdate({ destinationGallery: updatedGallery });
};
```

### Auto-populate Function
```typescript
const addDefaultSuggestions = () => {
  const defaultItems = [
    { name: `${data.destination} Skyline`, type: "city" as const },
    { name: `Local Markets`, type: "activity" as const },
    { name: `Historic Landmarks`, type: "landmark" as const },
    { name: `Cultural Activities`, type: "activity" as const }
  ];

  const existingGallery = data.destinationGallery || [];
  const newItems = defaultItems.filter(item => 
    !existingGallery.some(existing => existing.name === item.name)
  );

  if (newItems.length > 0) {
    const updatedGallery = [...existingGallery, ...newItems.map(item => ({
      name: item.name,
      image: "",
      type: item.type
    }))];
    onUpdate({ destinationGallery: updatedGallery });
  }
};
```

## State Management
- **Local state**: `newGalleryItem` (string) for input field
- **Array operations**: Add, remove, update via parent callback
- **Image state**: Managed by individual ImageInput components
- **Type state**: Managed within gallery array objects

## Validation Rules
- **Gallery item names**: 
  - Required (minimum 1 character after trim)
  - No duplicates allowed
  - Case-sensitive comparison
- **Types**: Must be one of "city", "activity", "landmark"
- **Images**: Optional for each gallery item
- **Array**: No minimum or maximum limits

## Component Props
```typescript
interface GalleryStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}
```

## Error Handling
- **Duplicate prevention**: Checks existing gallery item names
- **Empty input handling**: Requires non-empty gallery item name
- **Array safety**: Handles undefined destinationGallery array
- **Image failures**: Handled by ImageInput component
- **Type validation**: Ensures valid type selection

## Accessibility
- **Form labels**: Proper labeling for image inputs
- **Keyboard support**: Enter key for adding gallery items
- **Button states**: Add button disabled when input empty
- **Focus management**: Input gets focus after adding
- **Screen readers**: Descriptive button text and type labels
- **Color contrast**: Sufficient contrast for type selection buttons

## Dependencies
- **React**: useState hook for local state
- **React Hook Form**: Form integration
- **Lucide React**: Icons (X, Plus, Camera, MapPin)
- **UI Components**: Input, Label, Button, Card
- **ImageInput**: Custom image upload with compact mode

## Performance Considerations
- **Array operations**: O(n) for duplicate checking
- **Image loading**: Compact mode for faster loading
- **State updates**: Minimal re-renders with targeted updates
- **Memory usage**: Image URLs stored as strings
- **Auto-populate**: Efficient filtering to prevent duplicates

## Integration Points
- **Parent form**: Data flows via `onUpdate` callback
- **PDF generation**: Gallery images appear in destination showcase section
- **Image search**: Type-specific keywords improve search relevance
- **Form validation**: Optional validation for gallery content

## User Experience Features
- **Quick start**: Auto-populate suggestions for rapid setup
- **Immediate feedback**: Gallery items appear immediately when added
- **Visual hierarchy**: Clear distinction between add area and gallery list
- **Count display**: Shows number of gallery items in section header
- **Responsive images**: Compact mode prevents layout breaking
- **Empty state guidance**: Helpful messaging when no gallery items added
- **Type flexibility**: Easy switching between city/activity/landmark types

## Business Logic
- **Default type**: New items default to "activity" type
- **Smart suggestions**: Auto-generated based on destination name
- **Type-specific keywords**: Different image search terms per type
- **Visual consistency**: Uniform card design across all gallery items
- **Duplicate prevention**: Maintains unique gallery item names

## Type System Benefits
- **City**: For destination cityscapes, urban views, skylines
- **Activity**: For experiences, events, cultural activities
- **Landmark**: For monuments, historic sites, famous locations
- **Search optimization**: Each type generates appropriate image keywords
- **PDF organization**: Types can influence layout and grouping in final PDF 