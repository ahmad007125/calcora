import React from 'react';
import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  // @ts-expect-error Lucide icons indexed dynamically
  const IconComponent = Icons[name] || Icons.Calculator;
  return <IconComponent {...props} />;
};
