# Day-wise Plan Section Report

## Section Overview
- **Section ID**: `daywise`
- **Display Name**: Day-wise Plan
- **Description**: Daily itinerary
- **Icon**: Calendar
- **Step Number**: 5
- **Component**: `components/itinerary/day-wise-step.tsx`

## Form Elements

### 1. Day Management System
- **Field Type**: Dynamic Day Addition/Removal
- **Data Point**: `dayWiseItinerary` (Array<DayItem>)
- **Features**:
  - Add individual days
  - Remove specific days
  - Auto-renumber days when removed
  - Initialize with 3-day template

### 2. Individual Day Structure
Each day contains:
- **Day number**: Auto-generated and maintained
- **Day title**: Text input for day description
- **Day content**: Large textarea for detailed activities
- **Day image**: ImageInput component

## Data Structure

### TypeScript Interface
```typescript
interface DayItem {
  day: number;
  title: string;
  content: string;
  image?: string;
}

interface DayWiseData {
  dayWiseItinerary: Array<DayItem>;
}
```

## User Interactions

### Adding Days
1. **Add Day button**: Adds new day with incremented number
2. **Initialize 3 Days**: Quick start with 3 empty days
3. **Auto-numbering**: Days automatically numbered sequentially

### Managing Individual Days
- **Day title input**: Short descriptive title for the day
- **Day content textarea**: Detailed activities, timing, locations
- **Image upload**: Visual representation of day's activities
- **Remove day**: Trash icon removes specific day

### Day Content Guidelines
- **Structured format**: Morning, afternoon, evening activities
- **Timing details**: Specific times for major activities
- **Location information**: Specific venues and addresses
- **Transportation**: Details between locations

## Visual Design

### Header Section
- **Title**: "Day-wise Itinerary" with description
- **Action buttons**:
  - "Initialize 3 Days" (when empty)
  - "Add Day" (always available)
- **Button styling**: Outline and primary variants

### Day Cards Layout
- **Card per day**: Individual cards with badges
- **Header design**: Colored background (`bg-muted/30`)
- **Day badge**: Outlined badge with day number
- **Remove button**: Trash icon in header
- **Grid layout**: Two-column responsive (image + content)

### Content Structure
- **Left column**: Day image (full ImageInput)
- **Right column**: Title input + content textarea
- **Responsive**: Stacks on mobile (`grid-cols-1 lg:grid-cols-2`)

### Empty State
- **Centered card**: Large padding with helpful content
- **Calendar icon**: Large icon (12x12) with opacity
- **Multiple actions**: Both initialize and add first day options
- **Helpful text**: Guidance on getting started

## Component Features

### Day Image Integration
```typescript
<ImageInput
  label="Day Image"
  value={dayItem.image}
  onChange={(value) => updateDayImage(dayItem.day, value)}
  keywords={`${dayItem.title || `day ${dayItem.day}`} activities sightseeing`}
  placeholder={`Day ${dayItem.day} activities`}
/>
```

### Content Textarea
- **8 rows**: Large text area for detailed planning
- **Placeholder**: Comprehensive example with formatting
- **Example format**:
  ```
  Morning: Visit Wat Pho Temple (9:00 AM)
  Afternoon: Grand Palace tour (1:00 PM)
  Evening: Dinner cruise on Chao Phraya River (7:00 PM)
  ```

### Tips Section
- **Planning guidance**: Gray background card
- **Helpful tips**: Bullet list of planning considerations
- **Professional formatting**: Proper spacing and typography

## Helper Functions

### Day Management
```typescript
const addDay = () => {
  const newDay: DayItem = {
    day: data.dayWiseItinerary.length + 1,
    title: "",
    content: "",
    image: ""
  };
  const updatedItinerary = [...data.dayWiseItinerary, newDay];
  onUpdate({ dayWiseItinerary: updatedItinerary });
};

const removeDay = (dayToRemove: number) => {
  const updatedItinerary = data.dayWiseItinerary
    .filter(item => item.day !== dayToRemove)
    .map((item, index) => ({ ...item, day: index + 1 }));
  onUpdate({ dayWiseItinerary: updatedItinerary });
};

const initializeDays = () => {
  const initialDays: DayItem[] = [
    { day: 1, title: "", content: "", image: "" },
    { day: 2, title: "", content: "", image: "" },
    { day: 3, title: "", content: "", image: "" }
  ];
  onUpdate({ dayWiseItinerary: initialDays });
};
```

### Content Updates
```typescript
const updateDay = (dayNumber: number, field: 'title' | 'content', value: string) => {
  const updatedItinerary = data.dayWiseItinerary.map(item =>
    item.day === dayNumber
      ? { ...item, [field]: value }
      : item
  );
  onUpdate({ dayWiseItinerary: updatedItinerary });
};

const updateDayImage = (dayNumber: number, imageUrl: string) => {
  const updatedItinerary = data.dayWiseItinerary.map(item =>
    item.day === dayNumber
      ? { ...item, image: imageUrl }
      : item
  );
  onUpdate({ dayWiseItinerary: updatedItinerary });
};
```

## State Management
- **No local state**: All data managed by parent component
- **Array operations**: Add, remove, update via parent callback
- **Auto-renumbering**: Maintains sequential day numbers

## Validation Rules
- **Day numbers**: Auto-managed, always sequential starting from 1
- **Titles**: Optional, no specific validation
- **Content**: Optional, no length limits
- **Images**: Optional for each day
- **Array**: No minimum or maximum day limits

## Component Props
```typescript
interface DayWiseStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}
```

## Error Handling
- **Array safety**: Handles empty dayWiseItinerary array
- **Day numbering**: Automatic renumbering prevents gaps
- **Image failures**: Handled by ImageInput component
- **Content validation**: No specific error handling needed

## Accessibility
- **Form labels**: Proper `htmlFor` attributes for all inputs
- **Button accessibility**: Clear labels and keyboard support
- **Focus management**: Logical tab order through day elements
- **Screen readers**: Descriptive badges and button text

## Dependencies
- **React**: useState hook for local operations
- **React Hook Form**: Form integration
- **Lucide React**: Icons (Plus, Trash2, Calendar, Clock)
- **UI Components**: Input, Label, Textarea, Button, Card, Badge
- **ImageInput**: Custom image upload component

## Performance Considerations
- **Array operations**: Efficient filtering and mapping for day removal
- **Image loading**: Handled per-day by ImageInput components
- **Re-numbering**: O(n) operation when removing days
- **State updates**: Minimal re-renders with targeted updates

## Integration Points
- **Parent form**: Data flows via `onUpdate` callback
- **PDF generation**: Day images and content appear in day-wise section
- **Image search**: Keywords include day titles and generic activity terms
- **Form validation**: Optional validation for day content

## User Experience Features
- **Quick start**: Initialize 3 Days button for rapid setup
- **Flexible planning**: Add/remove days as needed
- **Visual feedback**: Immediate day appearance when added
- **Guided content**: Comprehensive placeholder text with examples
- **Professional tips**: Planning guidance at bottom of section
- **Responsive design**: Works well on mobile and desktop

## Planning Guidance
The component includes helpful tips for users:
- Include specific times and locations
- Add transportation details between locations
- Consider meal times and restaurant recommendations
- Include backup plans for weather-dependent activities
- Add relevant images to make each day visually appealing

## Business Logic
- **Sequential numbering**: Days always numbered 1, 2, 3, etc.
- **No gaps**: Removing day 2 of 4 results in days 1, 2, 3
- **Empty initialization**: Each new day starts with empty strings
- **Image keywords**: Include day title or generic "day X activities" 