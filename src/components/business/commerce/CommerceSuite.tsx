import * as React from 'react';
import {
  Check,
  CreditCard,
  Minus,
  PackageCheck,
  Plus,
  Receipt,
  ShoppingCart,
  Tag,
  Trash2,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { sanitizeImageUrl } from '../../../utils/url';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* ProductCard, ProductCatalog, ProductDetailPanel                            */
/* -------------------------------------------------------------------------- */

export interface CatalogProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  priceLabel: string;
  numericPrice: number;
  vendor?: string;
  description?: string;
  imageUrl?: string;
  stockCount: number;
}

export function ProductCard({
  product,
  onSelect,
  onAddToCart,
  className,
}: {
  product: CatalogProductItem;
  onSelect?: (product: CatalogProductItem) => void;
  onAddToCart?: (product: CatalogProductItem) => void;
  className?: string;
}) {
  const safeImg = product.imageUrl ? sanitizeImageUrl(product.imageUrl) : undefined;
  const outOfStock = product.stockCount <= 0;

  return (
    <Card className={cn('flex flex-col justify-between p-4 space-y-3', className)}>
      <div className="space-y-2.5">
        {safeImg && (
          <img
            src={safeImg}
            alt={product.name}
            className="h-32 w-full rounded-[var(--wdr-radius-md)] border border-border object-cover"
          />
        )}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-mono text-[11px] text-muted-foreground">{product.sku}</div>
            <h4 className="text-sm font-semibold text-foreground">{product.name}</h4>
            <div className="text-xs text-muted-foreground">
              {product.category}
              {product.vendor ? ` · ${product.vendor}` : ''}
            </div>
          </div>
          <span className="text-sm font-bold tabular-nums text-foreground">{product.priceLabel}</span>
        </div>
        {product.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <StatusBadge
          status={outOfStock ? 'error' : product.stockCount < 10 ? 'warning' : 'completed'}
          label={outOfStock ? 'Out of stock' : `${product.stockCount} available`}
        />
        <div className="flex items-center gap-1.5">
          {onSelect && (
            <Button size="sm" variant="outline" onClick={() => onSelect(product)}>
              Details
            </Button>
          )}
          {onAddToCart && (
            <Button
              size="sm"
              variant="primary"
              disabled={outOfStock}
              onClick={() => onAddToCart(product)}
            >
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function ProductCatalog({
  products,
  onSelectProduct,
  onAddToCart,
  className,
}: {
  products: CatalogProductItem[];
  onSelectProduct?: (product: CatalogProductItem) => void;
  onAddToCart?: (product: CatalogProductItem) => void;
  className?: string;
}) {
  const [category, setCategory] = React.useState('all');
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];
  const visible = category === 'all' ? products : products.filter((p) => p.category === category);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={category === cat ? 'primary' : 'outline'}
            onClick={() => setCategory(cat)}
          >
            {cat === 'all' ? 'All categories' : cat}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onSelect={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export function ProductDetailPanel({
  product,
  specs = [],
  onAddToCart,
  className,
}: {
  product: CatalogProductItem;
  specs?: Array<{ label: string; value: string }>;
  onAddToCart?: (product: CatalogProductItem, qty: number) => void;
  className?: string;
}) {
  const [qty, setQty] = React.useState(1);

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div>
          <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
          <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.description}</p>
        </div>
        <div className="text-xl font-bold tabular-nums text-foreground">{product.priceLabel}</div>
      </div>

      {specs.length > 0 && (
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
          {specs.map((sp) => (
            <div key={sp.label} className="flex items-center justify-between rounded border border-border px-3 py-2">
              <dt className="text-muted-foreground">{sp.label}</dt>
              <dd className="font-semibold text-foreground">{sp.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {onAddToCart && (
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="inline-flex items-center rounded-[var(--wdr-radius-md)] border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="inline-flex h-9 w-9 items-center justify-center border-r border-border hover:bg-muted"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="w-10 text-center text-xs font-semibold tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              className="inline-flex h-9 w-9 items-center justify-center border-l border-border hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <Button variant="primary" size="sm" onClick={() => onAddToCart(product, qty)}>
            Add {qty} to cart
          </Button>
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* ShoppingCartPanel, CheckoutSummary, OrderTrackingPanel                     */
/* -------------------------------------------------------------------------- */

export interface CartLineItem {
  id: string;
  name: string;
  unitPriceLabel: string;
  unitPrice: number;
  quantity: number;
}

export function ShoppingCartPanel({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currencySymbol = '$',
  className,
}: {
  items: CartLineItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout?: () => void;
  currencySymbol?: string;
  className?: string;
}) {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>Shopping cart</span>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{items.length} line items</span>
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">Your cart is empty.</p>
      ) : (
        <ul className="divide-y divide-border/70">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-xs">
              <div>
                <div className="font-semibold text-foreground">{item.name}</div>
                <div className="text-muted-foreground tabular-nums">{item.unitPriceLabel} each</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`Decrease quantity of ${item.name}`}
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                  -
                </Button>
                <span className="w-6 text-center font-mono font-semibold tabular-nums">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`Increase quantity of ${item.name}`}
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => onRemoveItem(item.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="font-medium text-muted-foreground">Subtotal</span>
        <span className="font-bold tabular-nums text-foreground">
          {currencySymbol}
          {subtotal.toFixed(2)}
        </span>
      </div>

      {onCheckout && (
        <Button fullWidth variant="primary" disabled={items.length === 0} onClick={onCheckout}>
          Continue to checkout summary
        </Button>
      )}
    </Card>
  );
}

export function CheckoutSummary({
  subtotalLabel,
  taxLabel,
  shippingLabel,
  totalLabel,
  paymentMethodLabel = 'External Checkout Handler',
  onSubmitOrder,
  className,
}: {
  subtotalLabel: string;
  taxLabel: string;
  shippingLabel: string;
  totalLabel: string;
  paymentMethodLabel?: string;
  onSubmitOrder?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>Order & Checkout Presentation</span>
      </div>
      <dl className="space-y-2 text-xs">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums text-foreground">{subtotalLabel}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="tabular-nums text-foreground">{shippingLabel}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Estimated tax</dt>
          <dd className="tabular-nums text-foreground">{taxLabel}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
          <dt>Total due</dt>
          <dd className="tabular-nums">{totalLabel}</dd>
        </div>
      </dl>
      <div className="rounded border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
        Payment delegation: <span className="font-semibold text-foreground">{paymentMethodLabel}</span>
      </div>
      {onSubmitOrder && (
        <Button fullWidth variant="primary" onClick={onSubmitOrder}>
          Confirm order summary
        </Button>
      )}
    </Card>
  );
}

export function OrderTrackingPanel({
  orderNumber,
  carrierLabel,
  etaLabel,
  checkpoints,
  refundStatus,
  className,
}: {
  orderNumber: string;
  carrierLabel: string;
  etaLabel: string;
  checkpoints: Array<{ id: string; label: string; timestamp: string; completed: boolean }>;
  refundStatus?: 'none' | 'requested' | 'approved' | 'refunded';
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <div>
            <div className="text-sm font-semibold text-foreground">Order {orderNumber}</div>
            <div className="text-xs text-muted-foreground">
              {carrierLabel} · ETA {etaLabel}
            </div>
          </div>
        </div>
        {refundStatus && refundStatus !== 'none' && <RefundStatusBadge status={refundStatus} />}
      </div>
      <ol className="space-y-2 border-l-2 border-border pl-4">
        {checkpoints.map((cp) => (
          <li key={cp.id} className="text-xs">
            <div className={cn('font-semibold', cp.completed ? 'text-foreground' : 'text-muted-foreground')}>
              {cp.label}
            </div>
            <div className="text-[11px] text-muted-foreground tabular-nums">{cp.timestamp}</div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* PricingTable, SubscriptionOverview, UsageMeter, Billing, Invoices, Refunds */
/* -------------------------------------------------------------------------- */

export interface PricingPlanTier {
  id: string;
  name: string;
  priceLabel: string;
  periodLabel: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
}

export function PricingTable({
  plans,
  activePlanId,
  onSelectPlan,
  className,
}: {
  plans: PricingPlanTier[];
  activePlanId?: string;
  onSelectPlan?: (planId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3', className)}>
      {plans.map((plan) => {
        const isCurrent = plan.id === activePlanId;
        return (
          <Card
            key={plan.id}
            className={cn(
              'flex flex-col justify-between p-5 space-y-4',
              plan.highlighted && 'border-foreground ring-1 ring-primary'
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-bold text-foreground">{plan.name}</h4>
                {isCurrent && <StatusBadge status="active" label="Current" />}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tabular-nums text-foreground">{plan.priceLabel}</span>
                <span className="text-xs text-muted-foreground">/{plan.periodLabel}</span>
              </div>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
              <ul className="space-y-1.5 border-t border-border pt-3 text-xs text-foreground">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {onSelectPlan && (
              <Button
                fullWidth
                size="sm"
                variant={plan.highlighted ? 'primary' : 'outline'}
                disabled={isCurrent}
                onClick={() => onSelectPlan(plan.id)}
              >
                {isCurrent ? 'Active plan' : (plan.ctaLabel ?? 'Select plan')}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export function UsageMeter({
  label,
  usedLabel,
  limitLabel,
  percentage,
  className,
}: {
  label: string;
  usedLabel: string;
  limitLabel: string;
  percentage: number;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-2', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">
          {usedLabel} / {limitLabel}
        </span>
      </div>
      <Progress
        value={Math.min(100, Math.max(0, percentage))}
        variant={percentage >= 90 ? 'destructive' : percentage >= 75 ? 'warning' : 'primary'}
        size="sm"
        showValue
      />
    </Card>
  );
}

export function SubscriptionOverview({
  planName,
  status,
  renewalDateLabel,
  seatsLabel,
  onManagePlan,
  className,
}: {
  planName: string;
  status: 'active' | 'pending' | 'warning';
  renewalDateLabel: string;
  seatsLabel: string;
  onManagePlan?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('flex flex-wrap items-center justify-between gap-4 p-5', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h4 className="text-base font-semibold text-foreground">{planName}</h4>
          <StatusBadge status={status} label={status} />
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          Renews {renewalDateLabel} · {seatsLabel}
        </p>
      </div>
      {onManagePlan && (
        <Button size="sm" variant="outline" onClick={onManagePlan}>
          Change plan
        </Button>
      )}
    </Card>
  );
}

export interface BillingInvoiceEntry {
  id: string;
  invoiceNumber: string;
  dateLabel: string;
  amountLabel: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
}

export function BillingHistoryTable({
  invoices,
  onDownloadInvoice,
  className,
}: {
  invoices: BillingInvoiceEntry[];
  onDownloadInvoice?: (invoiceId: string) => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Receipt className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>Billing history</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Invoice</th>
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium text-right">Amount</th>
              <th className="py-2 pr-3 font-medium">Payment status</th>
              {onDownloadInvoice && <th className="py-2 text-right font-medium">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="py-2 pr-3 font-mono font-semibold text-foreground">{inv.invoiceNumber}</td>
                <td className="py-2 pr-3 tabular-nums text-muted-foreground">{inv.dateLabel}</td>
                <td className="py-2 pr-3 text-right font-semibold tabular-nums text-foreground">
                  {inv.amountLabel}
                </td>
                <td className="py-2 pr-3">
                  <StatusBadge
                    status={
                      inv.status === 'paid'
                        ? 'completed'
                        : inv.status === 'failed'
                          ? 'error'
                          : 'pending'
                    }
                    label={inv.status}
                  />
                </td>
                {onDownloadInvoice && (
                  <td className="py-2 text-right">
                    <Button size="sm" variant="ghost" onClick={() => onDownloadInvoice(inv.id)}>
                      View PDF
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function InvoiceCard({
  invoiceNumber,
  issuedDate,
  customerLabel,
  totalLabel,
  status,
  className,
}: {
  invoiceNumber: string;
  issuedDate: string;
  customerLabel: string;
  totalLabel: string;
  status: 'paid' | 'pending' | 'overdue';
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold text-foreground">{invoiceNumber}</span>
        <StatusBadge
          status={status === 'paid' ? 'completed' : status === 'overdue' ? 'error' : 'pending'}
          label={status}
        />
      </div>
      <div className="text-xs text-muted-foreground">{customerLabel}</div>
      <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
        <span className="text-muted-foreground">Issued {issuedDate}</span>
        <span className="font-bold tabular-nums text-foreground">{totalLabel}</span>
      </div>
    </Card>
  );
}

export function RefundStatusBadge({
  status,
}: {
  status: 'requested' | 'approved' | 'refunded';
}) {
  return (
    <StatusBadge
      status={status === 'refunded' ? 'completed' : status === 'approved' ? 'active' : 'pending'}
      label={`Refund: ${status}`}
    />
  );
}

export function EntitlementList({
  entitlements,
  title = 'Included entitlements',
  className,
}: {
  entitlements: Array<{ id: string; name: string; quotaLabel: string; enabled: boolean }>;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="divide-y divide-border/60 text-xs">
        {entitlements.map((ent) => (
          <li key={ent.id} className="flex items-center justify-between gap-2 py-2">
            <div>
              <div className="font-medium text-foreground">{ent.name}</div>
              <div className="text-[11px] text-muted-foreground tabular-nums">{ent.quotaLabel}</div>
            </div>
            <StatusBadge
              status={ent.enabled ? 'completed' : 'draft'}
              label={ent.enabled ? 'Enabled' : 'Upgrade required'}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
