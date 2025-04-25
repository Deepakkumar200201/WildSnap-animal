
# UI Components Documentation

This project uses a collection of accessible and customizable UI components built with React, Radix UI, and styled with Tailwind CSS.

## Core Components

### Layout Components
- `Accordion`: Vertically stacked interactive headings
- `AspectRatio`: Maintains consistent width/height ratio
- `Card`: Container for related content
- `Collapsible`: Toggle visibility of content
- `Drawer`: Sliding panel from screen edge
- `Sheet`: Modal dialog that slides from edge

### Input Components
- `Button`: Interactive button element
- `Checkbox`: Selection control
- `Input`: Text input field
- `InputOTP`: One-time password input
- `RadioGroup`: Exclusive selection group
- `Select`: Dropdown selection
- `Slider`: Range input
- `Switch`: Toggle control
- `Textarea`: Multi-line text input

### Navigation Components
- `Breadcrumb`: Hierarchical navigation
- `DropdownMenu`: Contextual menu
- `Menubar`: Horizontal command bar
- `NavigationMenu`: Responsive navigation
- `Pagination`: Page navigation controls
- `Tabs`: Organize content into tabs

### Feedback Components
- `Alert`: Important messages
- `AlertDialog`: Critical confirmation dialogs
- `Progress`: Progress indicator
- `Toast`: Temporary notifications
- `Tooltip`: Contextual information

### Data Display
- `Avatar`: User profile picture
- `Badge`: Status indicator
- `Chart`: Data visualization
- `Table`: Tabular data display
- `ScrollArea`: Customizable scrolling container

### Utility Components
- `Dialog`: Modal dialogs
- `HoverCard`: Rich interactive tooltips
- `Label`: Form input labels
- `Popover`: Floating content
- `Separator`: Visual divider
- `Skeleton`: Loading placeholder

## Custom Components

### Application-Specific
- `Camera`: Camera interface component
- `ErrorView`: Error display component
- `Header`: Application header
- `HelpModal`: Help documentation modal
- `ImageUploader`: Image upload interface
- `LoadingView`: Loading state component
- `ResultsView`: Results display component

## Usage

Most components can be imported directly from the components directory:

```jsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
```

### Example Usage

```jsx
<Card>
  <CardHeader>
    <CardTitle>Form Example</CardTitle>
  </CardHeader>
  <CardContent>
    <form>
      <Input placeholder="Enter text..." />
      <Button>Submit</Button>
    </form>
  </CardContent>
</Card>
```

## Theme Customization

The components use CSS variables for theming, defined in `index.css`. The project supports both light and dark modes through the `.dark` class modifier.

## Hooks

- `use-mobile`: Detect mobile devices
- `use-toast`: Toast notification system

## Dependencies

The components are built on:
- React
- Radix UI primitives
- Tailwind CSS
- Framer Motion (for animations)
- Lucide React (for icons)

For detailed API documentation of individual components, refer to their respective files in the `components/ui` directory.
