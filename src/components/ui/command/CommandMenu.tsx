import { CommandPalette, type CommandItem, type CommandPaletteProps } from './CommandPalette';

export interface CommandMenuProps extends CommandPaletteProps {
  loading?: boolean;
}

export function CommandMenu({ loading = false, items, emptyMessage, ...props }: CommandMenuProps) {
  return (
    <CommandPalette
      {...props}
      items={loading ? [] : items}
      emptyMessage={loading ? 'Searching commands…' : emptyMessage}
    />
  );
}

export function CommandDialog(props: CommandMenuProps) {
  return <CommandMenu {...props} />;
}

export interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  loading?: boolean;
  placeholder?: string;
}

export function SearchCommand({
  open,
  onOpenChange,
  items,
  loading = false,
  placeholder = 'Type a command or search…',
}: SearchCommandProps) {
  return (
    <CommandMenu
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      loading={loading}
      placeholder={placeholder}
      enableGlobalShortcut
    />
  );
}
