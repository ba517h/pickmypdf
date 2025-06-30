# Experiences & Activities Section Report

## Section Overview
- **Section ID**: `experiences`
- **Display Name**: Experiences & Activities
- **Description**: Things to do
- **Icon**: Camera
- **Step Number**: 4
- **Component**: `components/itinerary/experiences-step.tsx`

## Form Elements

### 1. Add Experience System
- **Field Type**: Text Input + Add Button
- **Data Point**: `experiences` (Array<{name: string, image?: string}>)
- **Placeholder**: "e.g., Snorkeling in Phi Phi Islands, Temple Tour, Cooking Class"
- **Features**:
  - Dynamic experience addition
  - Duplicate prevention
  - Enter key support
  - Auto-clear input after adding

### 2. Experience Cards Display
- **Layout**: Individual cards per experience
- **Features**:
  - Compact image input (28px width)
  - Experience name display
  - Generic description
  - Activity badges
  - Remove functionality

## Data Structure

### TypeScript Interface
```typescript
interface ExperiencesData {
  experiences: Array<{
    name: string;
    image?: string;
  }>;
}
```

## User Interactions

### Adding Experiences
1. **Type experience name** in input field
2. **Press Enter** or **click Add button**
3. **Experience added** to array if not duplicate
4. **Input field cleared** automatically

### Managing Experience Images
- **ImageInput** with `compact={true}` prop
- **Keywords**: `${experience.name} ${data.destination || ''} activity experience adventure`
- **Placeholder**: Experience name as placeholder
- **Size**: Fixed 28px width for thumbnail display

### Removing Experiences
- **Remove button**: X icon in top-right of card
- **Confirmation**: Direct removal (no confirmation dialog)
- **Array update**: Filters out removed experience

## Visual Design

### Add Experience Card
- **Header**: "Add Experience" with Plus icon
- **Content**: Input field with Add button
- **Styling**: Standard card with border

### Experience Cards Layout
- **Individual cards**: Border with gray-200
- **Horizontal layout**: Image + content side-by-side
- **Gap**: 4-unit gap between image and content
- **Responsive**: Maintains layout on mobile

### Experience Card Content
- **Experience name**: Medium weight, base size, gray-900
- **Description**: "Unforgettable experience awaits"
- **Badge system**: Two default badges
  - **Activity badge**: Blue background (`bg-blue-100 text-blue-800`)
  - **Popular badge**: Green background (`bg-green-100 text-green-800`)
- **Remove button**: Ghost variant, hover shows destructive color

### Empty State
- **Dashed border**: 2px gray-300 dashed border
- **Centered content**: Camera icon, heading, description
- **Icon**: Large camera (12x12) in gray-400
- **Message**: "No experiences added yet" with helpful description

## Component Features

### Image Integration
```typescript
<ImageInput
  value={experience.image}
  onChange={(imageUrl) => updateExperienceImage(experience.name, imageUrl)}
  keywords={`${experience.name} ${data.destination || ''} activity experience adventure`}
  placeholder={`${experience.name}`}
  className="w-full"
  compact={true}
/>
```

### Badge Display
```typescript
<div className="flex items-center gap-1">
  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Activity</span>
  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Popular</span>
</div>
```

## Helper Functions

### Experience Management
```typescript
const addExperience = () => {
  if (newExperience.trim()) {
    const existingExperiences = data.experiences || [];
    if (!existingExperiences.some(exp => exp.name === newExperience.trim())) {
      const updatedExperiences = [...existingExperiences, { name: newExperience.trim(), image: "" }];
      onUpdate({ experiences: updatedExperiences });
      setNewExperience("");
    }
  }
};

const removeExperience = (nameToRemove: string) => {
  const updatedExperiences = (data.experiences || []).filter(exp => exp.name !== nameToRemove);
  onUpdate({ experiences: updatedExperiences });
};

const updateExperienceImage = (name: string, imageUrl: string) => {
  const updatedExperiences = (data.experiences || []).map(exp =>
    exp.name === name ? { ...exp, image: imageUrl } : exp
  );
  onUpdate({ experiences: updatedExperiences });
};
```

## State Management
- **Local state**: `newExperience` (string) for input field
- **Array operations**: Add, remove, update via parent callback
- **Image state**: Managed by individual ImageInput components

## Validation Rules
- **Experience names**: 
  - Required (minimum 1 character after trim)
  - No duplicates allowed
  - Case-sensitive comparison
- **Images**: Optional for each experience
- **Array**: No minimum or maximum limits

## Component Props
```typescript
interface ExperiencesStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}
```

## Error Handling
- **Duplicate prevention**: Checks existing experience names
- **Empty input handling**: Requires non-empty experience name
- **Array safety**: Handles undefined experiences array
- **Image failures**: Handled by ImageInput component

## Accessibility
- **Form labels**: Proper labeling for image inputs
- **Keyboard support**: Enter key for adding experiences
- **Button states**: Add button disabled when input empty
- **Focus management**: Input gets focus after adding
- **Screen readers**: Descriptive button text and badge content

## Dependencies
- **React**: useState hook for local state
- **React Hook Form**: Form integration
- **Lucide React**: Icons (X, Plus, Camera)
- **UI Components**: Input, Label, Button, Card
- **ImageInput**: Custom image upload with compact mode

## Performance Considerations
- **Array operations**: O(n) for duplicate checking
- **Image loading**: Compact mode for faster loading
- **State updates**: Minimal re-renders with targeted updates
- **Memory usage**: Image URLs stored as strings

## Integration Points
- **Parent form**: Data flows via `onUpdate` callback
- **PDF generation**: Experience images appear in experiences section
- **Image search**: Auto-generated keywords include "activity", "experience", "adventure"
- **Form validation**: Optional validation on submit

## User Experience Features
- **Immediate feedback**: Experiences appear immediately when added
- **Visual hierarchy**: Clear distinction between add area and experience list
- **Count display**: Shows number of experiences in section header
- **Responsive images**: Compact mode prevents layout breaking
- **Empty state guidance**: Helpful messaging when no experiences added
- **Visual consistency**: Uniform card design across all experiences

## Business Logic
- **Default badges**: All experiences get "Activity" and "Popular" badges
- **Generic description**: "Unforgettable experience awaits" for all
- **Image keywords**: Include activity-related terms for better search results
- **Visual branding**: Blue and green color scheme for activity categorization

## Semantic Differences from Hotels
- **Keywords**: Include "activity", "experience", "adventure" vs "hotel", "accommodation", "luxury"
- **Empty state icon**: Camera vs Star
- **Description**: Activity-focused vs accommodation-focused
- **Badge system**: Activity categories vs star ratings
- **Terminology**: "Experiences" vs "Hotels" throughout UI 