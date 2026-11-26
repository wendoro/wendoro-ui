import type { Meta, StoryObj } from '@storybook/react';
import {
  BillingHistoryTable,
  CheckoutSummary,
  EntitlementList,
  InvoiceCard,
  OrderTrackingPanel,
  PricingTable,
  ProductCatalog,
  RefundStatusBadge,
  SubscriptionOverview,
  UsageMeter,
} from '../src/components/business/commerce';
import {
  ActiveSessionsList,
  MfaVerificationView,
  PasskeyPrompt,
  PermissionMatrix,
  PrivacyConsentSettings,
  SessionExpirationWarning,
  SignInView,
} from '../src/components/business/identity';
import {
  BackgroundTaskStatus,
  ClipboardCopyButton,
  DevicePermissionPrompt,
  PwaInstallPrompt,
  PwaUpdatePrompt,
  RecordingIndicator,
} from '../src/components/business/device';
import { ErrorBoundary, RecoveryScreen } from '../src/components/ui/error-boundary';

const meta: Meta = {
  title: 'Wendoro UI/Commerce, Identity & Device Lifecycle',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Presentation-only UI modules covering Domain 15 (Commerce & Billing), Domain 16 (Identity & Security UX), Domain 20 (Device & PWA Lifecycle), and Domain 21 (ErrorBoundary & RecoveryScreen).',
      },
    },
  },
};

export default meta;

export const CommerceAndBilling: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <ProductCatalog
        products={[
          { id: 'p1', sku: 'WDR-KIT-01', name: 'Sample Starter Kit', category: 'Hardware', priceLabel: '$149', numericPrice: 149, stockCount: 24 },
          { id: 'p2', sku: 'WDR-POS-02', name: 'Enterprise Terminal', category: 'POS', priceLabel: '$499', numericPrice: 499, stockCount: 12 },
          { id: 'p3', sku: 'WDR-MOD-03', name: 'Analytics Add-on', category: 'Module', priceLabel: '$79/mo', numericPrice: 79, stockCount: 99 },
        ]}
        onAddToCart={() => {}}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PricingTable
          plans={[
            { id: 't1', name: 'Starter', priceLabel: '$49', periodLabel: 'mo', description: 'For small teams', features: ['3 workspaces', 'Standard support'] },
            { id: 't2', name: 'Scale', priceLabel: '$149', periodLabel: 'mo', description: 'For growing agencies', features: ['25 workspaces', 'Custom themes'], highlighted: true },
          ]}
          onSelectPlan={() => {}}
        />
        <div className="space-y-4">
          <SubscriptionOverview
            planName="Scale Multi-Tenant (Demo)"
            status="active"
            renewalDateLabel="Dec 31, 2026"
            seatsLabel="18 / 25 seats"
          />
          <UsageMeter label="Monthly API Events (Demo)" usedLabel="820k" limitLabel="1M" percentage={82} />
          <div className="flex flex-wrap items-center gap-2">
            <RefundStatusBadge status="requested" />
            <RefundStatusBadge status="refunded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CheckoutSummary
          subtotalLabel="$449.00"
          shippingLabel="$0.00"
          taxLabel="$0.00"
          totalLabel="$449.00"
          onSubmitOrder={() => {}}
        />
        <OrderTrackingPanel
          orderNumber="ORD-2026-042"
          carrierLabel="Demo Freight Carrier"
          etaLabel="Tomorrow, 4:00 PM"
          checkpoints={[
            { id: 's1', label: 'Order Placed', timestamp: '10:00 AM', completed: true },
            { id: 's2', label: 'Packed at Demo Hub', timestamp: '12:15 PM', completed: true },
            { id: 's3', label: 'Out for Delivery', timestamp: 'Pending', completed: false },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BillingHistoryTable
          invoices={[
            { id: 'inv-1', invoiceNumber: 'INV-2026-1101', dateLabel: 'Nov 1, 2026', amountLabel: '$149.00', status: 'paid' },
            { id: 'inv-2', invoiceNumber: 'INV-2026-1001', dateLabel: 'Oct 1, 2026', amountLabel: '$149.00', status: 'paid' },
          ]}
        />
        <div className="space-y-4">
          <InvoiceCard
            invoiceNumber="INV-2026-1101"
            issuedDate="Nov 1, 2026"
            customerLabel="Sample Organization"
            totalLabel="$149.00"
            status="paid"
          />
          <EntitlementList
            entitlements={[
              { id: 'e1', name: 'White-label themes', quotaLabel: 'Unlimited presets', enabled: true },
              { id: 'e2', name: 'Audit exports', quotaLabel: 'CSV & JSON', enabled: true },
              { id: 'e3', name: 'Dedicated SLA', quotaLabel: 'Enterprise tier', enabled: false },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

export const IdentityAndSecurityUX: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SignInView onSubmit={() => {}} onForgotPassword={() => {}} />
        <div className="space-y-4">
          <MfaVerificationView onVerify={() => {}} />
          <PasskeyPrompt onAuthenticate={() => {}} />
        </div>
      </div>
      <SessionExpirationWarning remainingLabel="4 minutes" onExtendSession={() => {}} onSignOut={() => {}} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActiveSessionsList
          sessions={[
            { id: 'ses-1', deviceName: 'Workstation Browser', locationLabel: 'Primary Office (Demo)', lastActiveLabel: 'Now', current: true },
            { id: 'ses-2', deviceName: 'Tablet Workspace', locationLabel: 'Remote Node (Demo)', lastActiveLabel: '2h ago', current: false },
          ]}
          onRevoke={() => {}}
        />
        <PrivacyConsentSettings
          consents={[
            { id: 'pc-1', title: 'Essential session security', description: 'Required for workspace integrity.', enabled: true, required: true },
            { id: 'pc-2', title: 'Telemetry diagnostics', description: 'Share anonymized latency metrics.', enabled: false },
          ]}
          onToggle={() => {}}
        />
      </div>
      <PermissionMatrix
        roleNames={['Owner', 'Admin', 'Viewer']}
        rows={[
          { capability: 'Billing & Invoices', roles: { Owner: true, Admin: true, Viewer: false } },
          { capability: 'Read Dashboards', roles: { Owner: true, Admin: true, Viewer: true } },
        ]}
      />
    </div>
  ),
};

export const DeviceLifecycleAndRecovery: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PwaInstallPrompt onInstall={() => {}} onDismiss={() => {}} />
        <PwaUpdatePrompt versionLabel="2.0.1" onReloadToUpdate={() => {}} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DevicePermissionPrompt
          capability="camera"
          status="prompt"
          onRequestPermission={() => {}}
        />
        <BackgroundTaskStatus
          tasks={[
            { id: 'bt-1', label: 'Exporting Sample Records CSV', progress: 72, status: 'running' },
            { id: 'bt-2', label: 'Verify theme contrast map', progress: 100, status: 'completed' },
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <RecordingIndicator recording durationLabel="01:18" onToggle={() => {}} />
        <ClipboardCopyButton value="https://wendoro.in" label="Copy Docs URL" />
      </div>
      <ErrorBoundary
        fallbackRender={({ error, reset }) => (
          <RecoveryScreen title="Caught Sample Error" description={error.message} onRetry={reset} />
        )}
      >
        <RecoveryScreen
          title="Sample Recovery View"
          description="Example presentation of error boundary fallback recovery."
          showDetails
          details="Trace: SampleComponent -> DemoSection"
          onRetry={() => {}}
          onResetHome={() => {}}
        />
      </ErrorBoundary>
    </div>
  ),
};
