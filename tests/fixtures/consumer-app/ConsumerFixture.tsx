import * as React from 'react';
import {
  ThemeProvider,
  useTheme,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Dialog,
  DialogFooter,
} from '@wendoro/ui';

export function ConsumerFixture() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <ThemeProvider defaultTheme="light" storageKey="consumer-fixture-theme">
      <ConsumerInner open={open} setOpen={setOpen} value={value} setValue={setValue} />
    </ThemeProvider>
  );
}

function ConsumerInner({
  open,
  setOpen,
  value,
  setValue,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  value: string;
  setValue: (v: string) => void;
}) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div data-testid="consumer-root" data-resolved-theme={resolvedTheme}>
      <Card>
        <CardHeader>
          <CardTitle>Consumer App Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            aria-label="Consumer input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter workspace"
          />
          <Button variant="primary" onClick={() => setOpen(true)}>
            Open Consumer Dialog
          </Button>
          <Button variant="outline" onClick={toggleTheme}>
            Switch Theme
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen} title="Consumer Dialog">
        <p>Verified consumer dialog from dist/lib/wendoro-ui.js.</p>
        <DialogFooter>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
