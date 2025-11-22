import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { TextInput, type TextInputProps } from 'react-native';

const inputVariants = cva(
  'h-10 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base leading-5 text-foreground shadow-sm shadow-black/5 dark:bg-input/30 sm:h-9',
  {
    variants: {
      variant: {
        default: cn('border-input'),
        destructive: cn('border-destructive text-destructive placeholder:text-destructive/60'),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type InputProps = TextInputProps &
  React.RefAttributes<TextInput> &
  VariantProps<typeof inputVariants>;

function Input({ className, variant, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        inputVariants({ variant }),
        props.editable === false && 'opacity-50 placeholder:text-muted-foreground/50',
        className
      )}
      {...props}
    />
  );
}

export { Input, inputVariants };
export type { InputProps };
