import * as React from 'react';
import {
  Clock,
  Fingerprint,
  KeyRound,
  Laptop,
  Lock,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { InputOTP, PasswordInput } from '../../ui/forms';
import { Switch } from '../../ui/switch';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* Auth & Recovery Views (Presentation Only — External Auth Execution)        */
/* -------------------------------------------------------------------------- */

export function SignInView({
  title = 'Sign in to workspace',
  subtitle = 'Authentication requests are delegated to your host identity provider.',
  onSubmit,
  onForgotPassword,
  onPasskeyClick,
  loading = false,
  className,
}: {
  title?: string;
  subtitle?: string;
  onSubmit: (payload: { email: string; password: string }) => void;
  onForgotPassword?: () => void;
  onPasskeyClick?: () => void;
  loading?: boolean;
  className?: string;
}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <Card className={cn('mx-auto w-full max-w-md p-6 space-y-4', className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, password });
        }}
        className="space-y-3"
      >
        <div className="space-y-1">
          <label htmlFor="wdr-signin-email" className="block text-xs font-medium text-foreground">
            Work email
          </label>
          <input
            id="wdr-signin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@example.invalid"
            className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
          />
        </div>
        <PasswordInput
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center justify-between text-xs">
          {onForgotPassword ? (
            <button type="button" onClick={onForgotPassword} className="underline text-muted-foreground hover:text-foreground">
              Recover account
            </button>
          ) : (
            <span />
          )}
          <Button type="submit" variant="primary" loading={loading}>
            Sign in
          </Button>
        </div>
      </form>
      {onPasskeyClick && (
        <div className="border-t border-border pt-3">
          <Button fullWidth variant="outline" leftIcon={<KeyRound className="h-4 w-4" />} onClick={onPasskeyClick}>
            Continue with passkey
          </Button>
        </div>
      )}
    </Card>
  );
}

export function SignUpView({
  onSubmit,
  loading = false,
  className,
}: {
  onSubmit: (payload: { fullName: string; email: string; password: string }) => void;
  loading?: boolean;
  className?: string;
}) {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <Card className={cn('mx-auto w-full max-w-md p-6 space-y-4', className)}>
      <div>
        <h3 className="text-lg font-semibold text-foreground">Create workspace account</h3>
        <p className="text-xs text-muted-foreground">Account provisioning is handled by your host auth adapter.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ fullName, email, password });
        }}
        className="space-y-3"
      >
        <div className="space-y-1">
          <label htmlFor="wdr-signup-name" className="block text-xs font-medium text-foreground">
            Full name
          </label>
          <input
            id="wdr-signup-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Demo User"
            className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="wdr-signup-email" className="block text-xs font-medium text-foreground">
            Email
          </label>
          <input
            id="wdr-signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@example.invalid"
            className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
          />
        </div>
        <PasswordInput
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="primary" loading={loading}>
          Request account
        </Button>
      </form>
    </Card>
  );
}

export function AccountRecoveryView({
  onSubmitEmail,
  onSubmitReset,
  mode = 'recover',
  className,
}: {
  mode?: 'recover' | 'reset';
  onSubmitEmail?: (email: string) => void;
  onSubmitReset?: (newPassword: string) => void;
  className?: string;
}) {
  const [email, setEmail] = React.useState('');
  const [nextPw, setNextPw] = React.useState('');

  return (
    <Card className={cn('mx-auto w-full max-w-md p-6 space-y-4', className)}>
      <h3 className="text-base font-semibold text-foreground">
        {mode === 'recover' ? 'Account recovery' : 'Set new password'}
      </h3>
      {mode === 'recover' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitEmail?.(email);
          }}
          className="space-y-3"
        >
          <input
            type="email"
            required
            aria-label="Recovery email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@example.invalid"
            className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
          />
          <Button type="submit" fullWidth variant="primary">
            Send recovery link
          </Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitReset?.(nextPw);
          }}
          className="space-y-3"
        >
          <PasswordInput
            label="New password"
            required
            value={nextPw}
            onChange={(e) => setNextPw(e.target.value)}
          />
          <Button type="submit" fullWidth variant="primary">
            Update password
          </Button>
        </form>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* MFA, Passkey, Biometric & Session Controls                                 */
/* -------------------------------------------------------------------------- */

export function MfaVerificationView({
  methodLabel = 'Authenticator code',
  onVerify,
  onResend,
  className,
}: {
  methodLabel?: string;
  onVerify: (code: string) => void;
  onResend?: () => void;
  className?: string;
}) {
  const [code, setCode] = React.useState('');

  return (
    <Card className={cn('mx-auto w-full max-w-md p-6 space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>Two-factor verification</span>
      </div>
      <p className="text-xs text-muted-foreground">Enter the 6-digit verification code from your {methodLabel}.</p>
      <InputOTP value={code} onValueChange={setCode} label={methodLabel} />
      <div className="flex items-center justify-between gap-2 pt-1">
        {onResend ? (
          <Button size="sm" variant="ghost" onClick={onResend}>
            Resend code
          </Button>
        ) : (
          <span />
        )}
        <Button size="sm" variant="primary" disabled={code.length < 6} onClick={() => onVerify(code)}>
          Verify code
        </Button>
      </div>
    </Card>
  );
}

export function PasskeyPrompt({
  accountLabel = 'demo@example.invalid',
  onAuthenticate,
  onCancel,
  className,
}: {
  accountLabel?: string;
  onAuthenticate: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <KeyRound className="h-4 w-4 text-primary-active" aria-hidden="true" />
        <span>Use your passkey</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Confirm identity for <span className="font-medium text-foreground">{accountLabel}</span> using your device security key.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="primary" onClick={onAuthenticate}>
          Continue with passkey
        </Button>
        {onCancel && (
          <Button size="sm" variant="outline" onClick={onCancel}>
            Use another method
          </Button>
        )}
      </div>
    </Card>
  );
}

export function BiometricPermissionPrompt({
  onEnable,
  onSkip,
  className,
}: {
  onEnable: () => void;
  onSkip?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Fingerprint className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>Enable biometric unlock</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Allow hardware-backed biometric verification via your host browser WebAuthn API.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="primary" onClick={onEnable}>
          Allow biometrics
        </Button>
        {onSkip && (
          <Button size="sm" variant="ghost" onClick={onSkip}>
            Not now
          </Button>
        )}
      </div>
    </Card>
  );
}

export function SessionExpirationWarning({
  remainingLabel,
  onExtendSession,
  onSignOut,
  className,
}: {
  remainingLabel: string;
  onExtendSession: () => void;
  onSignOut?: () => void;
  className?: string;
}) {
  return (
    <Card role="alert" className={cn('border-warning/60 bg-warning-subtle/40 p-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs">
          <Clock className="h-4 w-4 text-warning-subtle-foreground" aria-hidden="true" />
          <div>
            <div className="font-semibold text-foreground">Session expiring in {remainingLabel}</div>
            <div className="text-muted-foreground">Extend your session to avoid losing unsaved work.</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onSignOut && (
            <Button size="sm" variant="outline" onClick={onSignOut}>
              Sign out
            </Button>
          )}
          <Button size="sm" variant="primary" onClick={onExtendSession}>
            Stay signed in
          </Button>
        </div>
      </div>
    </Card>
  );
}

export interface SessionDeviceItem {
  id: string;
  deviceName: string;
  locationLabel: string;
  lastActiveLabel: string;
  current?: boolean;
}

export function ActiveSessionsList({
  sessions,
  onRevoke,
  title = 'Active sessions & trusted devices',
  className,
}: {
  sessions: SessionDeviceItem[];
  onRevoke?: (id: string) => void;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Laptop className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <ul className="divide-y divide-border/70">
        {sessions.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-xs">
            <div>
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <span>{s.deviceName}</span>
                {s.current && <StatusBadge status="active" label="Current device" />}
              </div>
              <div className="text-muted-foreground">
                {s.locationLabel} · Last active {s.lastActiveLabel}
              </div>
            </div>
            {!s.current && onRevoke && (
              <Button size="sm" variant="outline" onClick={() => onRevoke(s.id)}>
                Revoke
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Roles, Permission Matrix, Access Requests & Privacy Governance             */
/* -------------------------------------------------------------------------- */

export interface PermissionMatrixRow {
  capability: string;
  roles: Record<string, boolean>;
}

export function PermissionMatrix({
  roleNames,
  rows,
  onTogglePermission,
  title = 'Role & Permission Matrix',
  className,
}: {
  roleNames: string[];
  rows: PermissionMatrixRow[];
  onTogglePermission?: (capability: string, roleName: string, granted: boolean) => void;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Capability</th>
              {roleNames.map((r) => (
                <th key={r} className="px-3 py-2 text-center font-semibold text-foreground">
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row) => (
              <tr key={row.capability}>
                <td className="py-2 pr-4 font-medium text-foreground">{row.capability}</td>
                {roleNames.map((roleName) => {
                  const granted = Boolean(row.roles[roleName]);
                  return (
                    <td key={roleName} className="px-3 py-2 text-center">
                      {onTogglePermission ? (
                        <input
                          type="checkbox"
                          aria-label={`${row.capability} for ${roleName}`}
                          checked={granted}
                          onChange={(e) => onTogglePermission(row.capability, roleName, e.target.checked)}
                        />
                      ) : (
                        <StatusBadge status={granted ? 'completed' : 'draft'} label={granted ? 'Allow' : 'Deny'} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function AccessRequestPanel({
  requests,
  onApprove,
  onDeny,
  className,
}: {
  requests: Array<{ id: string; requester: string; resource: string; reason: string; status: 'pending' | 'approved' | 'denied' }>;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <UserCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>Access requests</span>
      </div>
      <ul className="space-y-2.5">
        {requests.map((req) => (
          <li key={req.id} className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-foreground">
                {req.requester} → {req.resource}
              </span>
              <StatusBadge
                status={req.status === 'approved' ? 'completed' : req.status === 'denied' ? 'error' : 'pending'}
                label={req.status}
              />
            </div>
            <p className="text-muted-foreground">{req.reason}</p>
            {req.status === 'pending' && (
              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={() => onApprove(req.id)}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDeny(req.id)}>
                  Deny
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function PrivacyConsentSettings({
  consents,
  onToggle,
  retentionDays,
  onChangeRetentionDays,
  className,
}: {
  consents: Array<{ id: string; title: string; description: string; enabled: boolean; required?: boolean }>;
  onToggle: (id: string, enabled: boolean) => void;
  retentionDays?: number;
  onChangeRetentionDays?: (days: number) => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShieldAlert className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>Privacy, consent & retention controls</span>
      </div>

      <ul className="divide-y divide-border/70">
        {consents.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-2.5">
            <div>
              <div className="text-xs font-semibold text-foreground">
                {item.title} {item.required && <span className="text-[10px] text-muted-foreground">(Required)</span>}
              </div>
              <div className="text-[11px] text-muted-foreground">{item.description}</div>
            </div>
            <Switch
              aria-label={`Toggle ${item.title}`}
              disabled={item.required}
              checked={item.enabled}
              onCheckedChange={(checked) => onToggle(item.id, checked)}
            />
          </li>
        ))}
      </ul>

      {retentionDays !== undefined && onChangeRetentionDays && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs">
          <label htmlFor="wdr-retention-days" className="font-medium text-foreground">
            Audit log retention window
          </label>
          <select
            id="wdr-retention-days"
            value={retentionDays}
            onChange={(e) => onChangeRetentionDays(Number(e.target.value))}
            className="h-8 rounded border border-input bg-surface px-2.5 text-xs text-foreground"
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={365}>365 days</option>
          </select>
        </div>
      )}
    </Card>
  );
}
