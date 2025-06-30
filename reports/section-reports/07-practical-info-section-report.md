# Practical Info Section Report

## Section Overview
- **Section ID**: `practical`
- **Display Name**: Practical Info
- **Description**: Visa, currency, tips
- **Icon**: Clock
- **Step Number**: 7
- **Component**: `components/itinerary/practical-info-step.tsx`

## Form Elements

### 1. Visa Requirements
- **Field Type**: Textarea
- **Data Point**: `practicalInfo.visa` (string)
- **Label**: "Visa Requirements"
- **Placeholder**: "e.g., Tourist visa required for stays over 30 days. Visa on arrival available for most countries."
- **Rows**: 3
- **CSS Classes**: `font-medium`

### 2. Currency & Money
- **Field Type**: Textarea
- **Data Point**: `practicalInfo.currency` (string)
- **Label**: "Currency & Money"
- **Placeholder**: "e.g., Thai Baht (THB). Credit cards widely accepted. ATMs available in major cities."
- **Rows**: 3
- **CSS Classes**: `font-medium`

### 3. Travel Tips System
- **Field Type**: Dynamic Tip Addition
- **Data Point**: `practicalInfo.tips` (string array)
- **Features**:
  - Add individual tips
  - Remove specific tips
  - Visual tip display with amber styling
  - Enter key support

## Data Structure

### TypeScript Interface
```typescript
interface PracticalInfoData {
  practicalInfo: {
    visa: string;
    currency: string;
    tips: string[];
    otherInclusions?: Array<{
      name: string;
      description?: string;
      image?: string;
    }>;
  };
}
```

## User Interactions

### Visa Information
- **Multi-line text input**: For detailed visa requirements
- **Free form content**: No specific validation or formatting requirements
- **Helpful placeholder**: Provides example content structure

### Currency Information
- **Multi-line text input**: For currency and payment details
- **Free form content**: Covers currency, cards, ATMs, payment methods
- **Helpful placeholder**: Shows comprehensive currency information example

### Travel Tips Management
1. **Type tip** in input field
2. **Press Enter** or **click Plus button**
3. **Tip added** to array if not duplicate
4. **Input field cleared** automatically
5. **Remove tips**: X button on individual tip cards

## Visual Design

### Section Layout
- **Single column**: All elements stacked vertically
- **Spacing**: 6-unit spacing between sections (`space-y-6`)
- **Card-based**: Travel tips section wrapped in card

### Text Areas
- **Standard styling**: Medium font weight
- **3 rows**: Sufficient space for detailed information
- **Consistent labeling**: Semibold labels with muted foreground

### Travel Tips Card
- **Header**: "Travel Tips" title
- **Input section**: Input field with Plus button
- **Tips display**: Individual tip cards with amber styling
- **Visual hierarchy**: Clear separation between input and existing tips

### Tip Display Cards
- **Amber theme**: `bg-amber-50 border border-amber-200`
- **Text color**: `text-amber-800`
- **Layout**: Flex with tip content and remove button
- **Remove button**: Ghost variant with destructive hover
- **Spacing**: Proper padding and gap management

### Empty State
- **Dashed border**: 2px gray-300 dashed border
- **Centered content**: Clock icon, heading, description
- **Icon**: Large clock (12x12) in gray-400
- **Message**: "No practical information added yet" with helpful description
- **Condition**: Shows when all fields are empty

## Component Features

### Travel Tips Input
```typescript
<div className="flex gap-2">
  <Input
    placeholder="Add a travel tip"
    value={newTip}
    onChange={(e) => setNewTip(e.target.value)}
    onKeyPress={handleKeyPress}
    className="font-medium"
  />
  <Button
    type="button"
    variant="outline"
    onClick={addTip}
    disabled={!newTip.trim()}
  >
    <Plus className="w-4 h-4" />
  </Button>
</div>
```

### Individual Tip Display
```typescript
{data.practicalInfo?.tips.map((tip, index) => (
  <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="flex-1 text-sm text-amber-800">{tip}</div>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => removeTip(tip)}
      className="h-6 w-6 p-0 hover:text-destructive"
    >
      <X className="w-3 h-3" />
    </Button>
  </div>
))}
```

## Helper Functions

### Input Management
```typescript
const handleInputChange = (field: string, value: string) => {
  onUpdate({ 
    practicalInfo: { 
      ...data.practicalInfo, 
      [field]: value 
    } 
  });
};

const addTip = () => {
  if (newTip.trim()) {
    const existingTips = data.practicalInfo?.tips || [];
    if (!existingTips.includes(newTip.trim())) {
      const updatedTips = [...existingTips, newTip.trim()];
      onUpdate({ 
        practicalInfo: { 
          ...data.practicalInfo, 
          tips: updatedTips 
        } 
      });
      setNewTip("");
    }
  }
};

const removeTip = (tipToRemove: string) => {
  const updatedTips = (data.practicalInfo?.tips || []).filter(tip => tip !== tipToRemove);
  onUpdate({ 
    practicalInfo: { 
      ...data.practicalInfo, 
      tips: updatedTips 
    } 
  });
};
```

### Keyboard Support
```typescript
const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTip();
  }
};
```

## State Management
- **Local state**: `newTip` (string) for tip input field
- **Nested object updates**: Complex updates to practicalInfo object
- **Array operations**: Add, remove tips via array manipulation

## Validation Rules
- **Visa information**: Optional, no specific validation
- **Currency information**: Optional, no specific validation
- **Travel tips**: 
  - Required (minimum 1 character after trim)
  - No duplicates allowed
  - Case-sensitive comparison
- **Empty handling**: All fields optional, empty state shown when all empty

## Component Props
```typescript
interface PracticalInfoStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}
```

## Error Handling
- **Duplicate prevention**: Checks existing tips before adding
- **Empty input handling**: Requires non-empty tip content
- **Nested object safety**: Handles undefined practicalInfo object
- **Array safety**: Handles undefined tips array

## Accessibility
- **Form labels**: Proper `htmlFor` attributes for textareas
- **Keyboard support**: Enter key for adding tips
- **Button states**: Add button disabled when tip input empty
- **Focus management**: Input clears and maintains focus after adding
- **Screen readers**: Descriptive labels and button text
- **Color contrast**: Sufficient contrast in amber tip styling

## Dependencies
- **React**: useState hook for local state
- **React Hook Form**: Form integration
- **Lucide React**: Icons (X, Plus, Clock)
- **UI Components**: Input, Label, Textarea, Button, Card
- **No ImageInput**: This section is text-only

## Performance Considerations
- **Array operations**: O(n) for duplicate checking
- **State updates**: Nested object updates require careful spreading
- **Re-renders**: Minimal with targeted state updates
- **Memory usage**: Tips stored as string array

## Integration Points
- **Parent form**: Data flows via `onUpdate` callback with nested updates
- **PDF generation**: Practical info appears in dedicated PDF section
- **Form validation**: All fields optional, minimal validation needed
- **No images**: This section focuses purely on textual information

## User Experience Features
- **Immediate feedback**: Tips appear immediately when added
- **Visual distinction**: Amber styling makes tips stand out
- **Clear actions**: Obvious add/remove functionality
- **Helpful examples**: Comprehensive placeholder text with real examples
- **Empty state guidance**: Clear messaging when section is empty
- **Flexible content**: Free-form text allows for any practical information

## Content Guidelines
### Visa Requirements
- Tourist visa requirements and duration limits
- Visa on arrival availability
- Required documents and processing times
- Special considerations for different nationalities

### Currency & Money
- Local currency name and symbol
- Credit card acceptance rates
- ATM availability and fees
- Tipping customs and cash requirements
- Exchange rate considerations

### Travel Tips
- Safety and security advice
- Cultural etiquette and customs
- Local laws and regulations
- Health and medical considerations
- Transportation tips
- Communication advice
- Emergency contact information

## Business Logic
- **Optional nature**: All fields optional to accommodate different trip types
- **Flexible format**: Free-form text allows comprehensive information
- **Visual hierarchy**: Tips get special amber styling for prominence
- **No character limits**: Allows for detailed practical information
- **Duplicate prevention**: Maintains unique travel tips list 