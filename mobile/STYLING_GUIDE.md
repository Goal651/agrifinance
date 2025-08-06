# AgriFinance Styling Guide

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary-green: #059669;     /* Main brand color */
--primary-blue: #2563eb;      /* Secondary brand color */
--primary-purple: #7c3aed;    /* Accent color */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography

```css
/* Font Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
--text-4xl: 36px;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing

```css
/* Padding/Margin */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-3xl: 32px;
--radius-full: 9999px;
```

## 📱 Screen Layouts

### Standard Screen Structure

```tsx
<View className="flex-1 bg-gray-50">
  {/* Header */}
  <Header 
    title="Screen Title"
    subtitle="Optional subtitle"
    showBack={true}
  />
  
  {/* Content */}
  <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
    {/* Screen content */}
  </ScrollView>
</View>
```

### Card Layout

```tsx
<Card title="Card Title" variant="elevated">
  <Text className="text-gray-600 mb-4">
    Card content goes here
  </Text>
  <Button title="Action" onPress={handleAction} />
</Card>
```

### Form Layout

```tsx
<View className="space-y-4">
  <Input
    label="Field Label"
    placeholder="Enter value"
    value={value}
    onChangeText={setValue}
    required
  />
  <Button title="Submit" onPress={handleSubmit} loading={loading} />
</View>
```

## 🎯 Component Patterns

### Status Badges

```tsx
const StatusBadge = ({ status, label }: { status: string; label?: string }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
  };

  return (
    <View className={`px-3 py-1 rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      <Text className="text-xs font-medium">{label || status.toUpperCase()}</Text>
    </View>
  );
};
```

### List Items

```tsx
<TouchableOpacity className="bg-white p-4 border-b border-gray-100">
  <View className="flex-row justify-between items-start">
    <View className="flex-1">
      <Text className="font-medium text-gray-900">Item Title</Text>
      <Text className="text-gray-500 text-sm mt-1">Item description</Text>
    </View>
    <View className="items-end">
      <Text className="font-semibold text-gray-900">$1,000</Text>
      <StatusBadge status="approved" />
    </View>
  </View>
</TouchableOpacity>
```

### Action Buttons

```tsx
<View className="flex-row space-x-3">
  <Button
    title="Primary Action"
    onPress={handlePrimary}
    variant="primary"
    size="medium"
  />
  <Button
    title="Secondary Action"
    onPress={handleSecondary}
    variant="outline"
    size="medium"
  />
</View>
```

## 📊 Data Visualization

### Progress Bars

```tsx
<View className="mb-4">
  <View className="flex-row justify-between mb-2">
    <Text className="text-sm text-gray-600">Progress</Text>
    <Text className="text-sm font-medium text-gray-900">75%</Text>
  </View>
  <View className="h-2 w-full bg-gray-200 rounded-full">
    <View className="h-2 bg-green-600 rounded-full" style={{ width: '75%' }} />
  </View>
</View>
```

### Statistics Cards

```tsx
<View className="bg-white rounded-2xl p-6 shadow-lg">
  <View className="flex-row items-center justify-between mb-4">
    <Text className="text-lg font-semibold text-gray-800">Total Loans</Text>
    <View className="bg-green-100 p-2 rounded-full">
      <MaterialIcons name="trending-up" size={24} color="#059669" />
    </View>
  </View>
  <Text className="text-3xl font-bold text-gray-900">$125,000</Text>
  <Text className="text-sm text-green-600 mt-1">+12% from last month</Text>
</View>
```

## 🎨 Screen-Specific Patterns

### Loan Screens

- **Primary Color**: Green (#059669)
- **Status Colors**: Green (approved), Yellow (pending), Red (rejected)
- **Layout**: Card-based with clear status indicators
- **Actions**: Approve, Reject, Disburse buttons prominently displayed

### Project Screens

- **Primary Color**: Blue (#2563eb)
- **Status Colors**: Blue (active), Green (completed), Yellow (on hold)
- **Layout**: Timeline-based with goals and tasks
- **Actions**: Create, Edit, Complete buttons for goals and tasks

### Admin Screens

- **Primary Color**: Purple (#7c3aed)
- **Status Colors**: Consistent with user screens
- **Layout**: Table-like with bulk actions
- **Actions**: Manage, Approve, Delete buttons

### User Screens

- **Primary Color**: Green (#059669)
- **Status Colors**: Green (active), Red (suspended), Gray (inactive)
- **Layout**: Profile-based with personal information
- **Actions**: Edit, Update, Manage buttons

## 🔧 Implementation Guidelines

### 1. Consistent Spacing

- Use Tailwind spacing classes: `p-4`, `m-6`, `space-y-4`
- Maintain consistent padding around content areas
- Use `px-4` for horizontal padding on screens

### 2. Color Usage

- Always use semantic colors (success, warning, error, info)
- Use gray scale for text and backgrounds
- Maintain contrast ratios for accessibility

### 3. Typography

- Use consistent font sizes and weights
- Maintain hierarchy with heading sizes
- Use appropriate text colors for different contexts

### 4. Interactive Elements

- Provide clear hover and active states
- Use consistent button styles
- Maintain touch target sizes (minimum 44px)

### 5. Loading States

- Show loading indicators for async operations
- Use skeleton screens for better UX
- Provide error states with retry options

## 📱 Responsive Design

### Mobile-First Approach

- Design for mobile screens first
- Use flexible layouts that adapt to different screen sizes
- Test on various device sizes

### Touch Interactions

- Ensure touch targets are large enough (44px minimum)
- Provide visual feedback for touch interactions
- Use appropriate gestures for navigation

## 🎯 Accessibility

### Color Contrast

- Maintain WC AA contrast ratios
- Don't rely solely on color to convey information
- Provide alternative text for images

### Screen Readers

- Use semantic HTML elements
- Provide proper labels for form inputs
- Include descriptive text for interactive elements

## 🚀 Performance

### Image Optimization

- Use appropriate image formats
- Implement lazy loading for images
- Optimize image sizes for mobile

### Animation Guidelines

- Keep animations smooth (60fps)
- Use subtle animations for feedback
- Avoid excessive animations that distract users

This styling guide ensures consistency across all screens and provides a solid foundation for the AgriFinance app's design system.
