# Cover Page Section Report

## Section Overview
- **Section ID**: `cover`
- **Display Name**: Cover Page
- **Description**: Trip title and header
- **Icon**: FileText
- **Step Number**: 1
- **Component**: `components/itinerary/cover-page-step.tsx`

## Form Elements

### 1. Cover Image
- **Field Type**: Image Input (ImageInput component)
- **Data Point**: `mainImage` (string, optional)
- **Placeholder**: "Main itinerary cover image"
- **Keywords**: Dynamic based on destination (`${data.destination || 'travel'} destination landscape`)
- **Purpose**: Main visual element for the itinerary cover

### 2. Trip Title
- **Field Type**: Text Input (required)
- **Data Point**: `title` (string)
- **Label**: "Trip Title *"
- **Placeholder**: "e.g., Amazing Southeast Asia Adventure"
- **Validation**: Required field
- **CSS Classes**: `font-medium`

### 3. Destination
- **Field Type**: Text Input (required)
- **Data Point**: `destination` (string)
- **Label**: "Destination *"
- **Placeholder**: "e.g., Thailand, Vietnam, Cambodia"
- **Validation**: Required field
- **CSS Classes**: `font-medium`

### 4. Duration
- **Field Type**: Text Input (required)
- **Data Point**: `duration` (string)
- **Label**: "Duration *"
- **Placeholder**: "e.g., 14 days, 2 weeks, 10 days 9 nights"
- **Validation**: Required field
- **CSS Classes**: `font-medium`

### 5. Estimated Cost
- **Field Type**: Text Input (optional)
- **Data Point**: `costInINR` (string, optional)
- **Label**: "Estimated Cost (₹)"
- **Placeholder**: "e.g., 1,42,000 / person"
- **Default Value**: "1,42,000 / person"
- **CSS Classes**: `font-medium`

### 6. Tags System
- **Field Type**: Interactive Tag Selection
- **Data Point**: `tags` (string array)
- **Label**: "Tags"
- **Features**:
  - Pre-selected tags with checkmarks
  - Recommended tags as buttons
  - Custom tag input functionality
  - Remove tag functionality

#### Recommended Tags List
```typescript
const recommendedTags = [
  "Adventure", "Cultural", "Photography", "Foodie", 
  "Budget", "Luxury", "Nature", "Urban", "Beach", 
  "Mountains", "Backpacking", "Family-Friendly"
];
```

#### Default Tags
```typescript
tags: ["Adventure", "Cultural", "Photography", "Foodie"]
```

## Data Structure

### TypeScript Interface
```typescript
interface CoverPageData {
  title: string;                    // Required
  destination: string;              // Required  
  duration: string;                 // Required
  costInINR?: string;              // Optional
  mainImage?: string;              // Optional
  tags: string[];                  // Array of strings
}
```

## User Interactions

### Tag Management
1. **Add Recommended Tag**: Click on recommended tag button → adds to selected tags
2. **Remove Tag**: Click X button next to selected tag → removes from array
3. **Add Custom Tag**: 
   - Click "Add Custom" button → shows input field
   - Type custom tag → press Enter or click "Add" button
   - Tag added to array if not duplicate

### Image Upload
- Uses `ImageInput` component with smart keyword generation
- Supports both URL input and file upload
- Auto-generates search keywords based on destination

## Validation Rules
- **Title**: Required, cannot be empty
- **Destination**: Required, cannot be empty
- **Duration**: Required, cannot be empty
- **Cost**: Optional, has default value
- **Tags**: No minimum required, duplicates prevented
- **Image**: Optional

## Component Props
```typescript
interface CoverPageStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}
```

## State Management
- Local state for `newTag` (string) - for custom tag input
- Local state for `showCustomInput` (boolean) - controls input visibility
- Form data managed by parent component via `onUpdate` callback

## Visual Design
- **Layout**: Single column layout with cards
- **Spacing**: 6-unit spacing between elements (`space-y-6`)
- **Cards**: Main image in dedicated card with header/content
- **Typography**: Semibold labels, medium weight inputs
- **Colors**: 
  - Selected tags: Blue theme (`bg-blue-100 text-blue-800`)
  - Unselected tags: Outline buttons
  - Custom input: Dashed border

## Error Handling
- Prevents duplicate tags
- Validates required fields on form submission
- Graceful handling of image upload failures

## Accessibility
- Proper form labels with `htmlFor` attributes
- Keyboard navigation support (Enter key for tag addition)
- Focus management for custom tag input
- Screen reader friendly button labels

## Dependencies
- React Hook Form integration
- Lucide React icons (X, Plus)
- Custom UI components (Input, Label, Badge, Button, Card)
- ImageInput component for image handling

## Performance Considerations
- Tag operations are O(n) for duplicate checking
- Image loading handled by ImageInput component
- Local state updates don't trigger full form re-renders

## Integration Points
- Form data flows to parent component via `onUpdate`
- Integrates with React Hook Form instance
- Image keywords dynamically generated from destination field
- Tags influence PDF generation and filtering capabilities 