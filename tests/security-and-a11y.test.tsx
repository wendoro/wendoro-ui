import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Avatar } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { MegaMenu } from '@/components/ui/navigation-ext';
import { DataTable } from '@/components/business/data-table';
import { UserProfile } from '@/components/business/user-profile';
import { ThemeProvider } from '@/hooks/use-theme';
import { sanitizeImageUrl, sanitizeUrl } from '@/utils/url';

describe('Security Hardening & SSR Safety', () => {
  it('validates href URLs and blocks dangerous schemes', () => {
    expect(sanitizeUrl('https://wendoro.in/docs')).toBe('https://wendoro.in/docs');
    expect(sanitizeUrl('http://localhost:3000/demo')).toBe('http://localhost:3000/demo');
    expect(sanitizeUrl('/workspace/overview')).toBe('/workspace/overview');
    expect(sanitizeUrl('#section')).toBe('#section');
    expect(sanitizeUrl('mailto:lead@demo.invalid')).toBe('mailto:lead@demo.invalid');
    expect(sanitizeUrl('tel:+15550100')).toBe('tel:+15550100');

    expect(sanitizeUrl('javascript:alert(1)')).toBeUndefined();
    expect(sanitizeUrl('  JaVaScRiPt:alert(1)')).toBeUndefined();
    expect(sanitizeUrl('java\nscript:alert(1)')).toBeUndefined();
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBeUndefined();
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined();
    expect(sanitizeUrl('//untrusted.example/redirect')).toBeUndefined();
  });

  it('validates image URLs and blocks SVG data URIs or script schemes', () => {
    expect(sanitizeImageUrl('https://cdn.wendoro.invalid/avatar.png')).toBe(
      'https://cdn.wendoro.invalid/avatar.png'
    );
    expect(sanitizeImageUrl('/assets/sample.png')).toBe('/assets/sample.png');
    expect(sanitizeImageUrl('blob:https://app.wendoro.invalid/123')).toBe(
      'blob:https://app.wendoro.invalid/123'
    );
    expect(sanitizeImageUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(
      'data:image/png;base64,iVBORw0KGgo='
    );

    expect(sanitizeImageUrl('data:image/svg+xml;base64,PHN2Zz4=')).toBeUndefined();
    expect(sanitizeImageUrl('javascript:alert(1)')).toBeUndefined();
    expect(sanitizeImageUrl('//untrusted.example/img.png')).toBeUndefined();
  });

  it('neutralizes untrusted href and src props across Breadcrumb, NavigationMenu, MegaMenu, UserProfile, and Avatar', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Breadcrumb
          items={[
            { label: 'Unsafe Crumb', href: 'javascript:alert(1)' },
            { label: 'Safe Crumb', href: 'https://wendoro.in' },
            { label: 'Current' },
          ]}
        />
        <NavigationMenu
          items={[
            { id: 'unsafe', label: 'Unsafe Nav', href: 'javascript:alert(1)' },
            { id: 'safe', label: 'Safe Nav', href: '/docs' },
          ]}
        />
        <MegaMenu
          sections={[
            {
              id: 'sec',
              label: 'Open Mega',
              groups: [
                {
                  title: 'Security Check',
                  links: [
                    { id: 'bad', label: 'Blocked Link', href: 'javascript:alert(1)' },
                    { id: 'good', label: 'Allowed Link', href: 'https://wendoro.in/docs' },
                  ],
                },
              ],
            },
          ]}
        />
        <UserProfile
          name="Demo Lead"
          contactHref="javascript:alert(document.cookie)"
        />
        <Avatar
          alt="Sample Avatar"
          src="data:image/svg+xml;base64,PHN2Zz4="
        />
        <DataTable
          data={[{ id: '1', label: '<img src=x onerror=alert(1)>' }]}
          columns={[{ key: 'label', header: 'Label', cell: (r) => r.label }]}
          getRowId={(r) => r.id}
        />
      </div>
    );

    const unsafeCrumb = screen.getByRole('button', { name: 'Unsafe Crumb' });
    expect(unsafeCrumb).not.toHaveAttribute('href');
    expect(screen.getByRole('link', { name: 'Safe Crumb' })).toHaveAttribute(
      'href',
      'https://wendoro.in'
    );

    const unsafeNav = screen.getByRole('button', { name: 'Unsafe Nav' });
    expect(unsafeNav).not.toHaveAttribute('href');
    expect(screen.getByRole('link', { name: 'Safe Nav' })).toHaveAttribute('href', '/docs');

    await user.click(screen.getByRole('button', { name: /Open Mega/i }));
    const blockedMega = screen.getByRole('button', { name: 'Blocked Link' });
    expect(blockedMega).not.toHaveAttribute('href');
    expect(screen.getByRole('link', { name: 'Allowed Link' })).toHaveAttribute(
      'href',
      'https://wendoro.in/docs'
    );

    // Raw HTML strings in DataTable render safely as text nodes, never executable DOM nodes
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument();

    expect(screen.queryByRole('img', { name: 'Sample Avatar' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Sample Avatar')).toHaveTextContent('SA');
  });

  it('renders cleanly during server-side renderToString without throwing', () => {
    const html = renderToString(
      <ThemeProvider scoped defaultTheme="dark">
        <Button variant="primary">SSR Action</Button>
      </ThemeProvider>
    );
    expect(html).toContain('SSR Action');
    expect(html).toContain('data-theme="dark"');
  });
});
