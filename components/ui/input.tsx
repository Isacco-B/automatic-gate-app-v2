import { cn } from '@/lib/utils';
import { TextInput, type TextInputProps } from 'react-native';

function Input({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        'h-10 w-full min-w-0 flex-row items-center rounded-md border border-input bg-background px-3 py-1 text-base leading-5 text-foreground shadow-sm shadow-black/5 file:flex dark:bg-input/30 dark:placeholder:text-foreground/30 sm:h-9',
        props.editable === false && cn('opacity-50 placeholder:text-muted-foreground/50'),
        className
      )}
      {...props}
    />
  );
}

export { Input };
