import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Database, Code } from 'lucide-react';
import { StorageMode } from '@/types/student';

interface ModeToggleProps {
  mode: StorageMode;
  onModeChange: (mode: StorageMode) => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <Database className="h-5 w-5 text-blue-600" />
        <Label htmlFor="mode-toggle" className="text-sm font-medium">
          MySQL Database
        </Label>
      </div>
      
      <Switch
        id="mode-toggle"
        checked={mode === 'c_structures'}
        onCheckedChange={(checked) => 
          onModeChange(checked ? 'c_structures' : 'mysql')
        }
        className="data-[state=checked]:bg-green-600"
      />
      
      <div className="flex items-center space-x-2">
        <Code className="h-5 w-5 text-green-600" />
        <Label htmlFor="mode-toggle" className="text-sm font-medium">
          C Data Structures
        </Label>
      </div>
      
      <div className="ml-4 px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
        Current: {mode === 'mysql' ? 'MySQL Database' : 'C Linear Data Structures'}
      </div>
    </div>
  );
}