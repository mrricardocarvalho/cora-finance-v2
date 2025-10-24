/**
 * Archive Toggle
 *
 * Toggle switch to show/hide archived items in lists.
 * Provides consistent UX across all CRUD screens.
 *
 * @module components/shared/archive-toggle
 */

'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ArchiveToggleProps {
  showArchived: boolean;
  onToggle: (show: boolean) => void;
}

/**
 * Toggle to show/hide archived items
 *
 * Usage:
 * ```tsx
 * const [showArchived, setShowArchived] = useState(false);
 * <ArchiveToggle showArchived={showArchived} onToggle={setShowArchived} />
 * ```
 */
export function ArchiveToggle({ showArchived, onToggle }: ArchiveToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="show-archived"
        checked={showArchived}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="show-archived" className="text-sm text-muted-foreground">
        Show archived
      </Label>
    </div>
  );
}
