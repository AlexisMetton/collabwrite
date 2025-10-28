import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title, description, icon = <FileText className="h-12 w-12 text-muted-foreground" />,
  action, className = '',
}) => {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-muted p-4">{icon}</div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
        {action && (
          <Button onClick={action.onClick} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EmptyState;
