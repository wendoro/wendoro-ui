import * as React from 'react';
import { BookOpen, CheckCircle2, HelpCircle, LifeBuoy, Search, Settings2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { EmptyState } from '../../ui/empty-state';
import { StickyActionBar } from '../../ui/mobile/MobilePrimitives';

/* -------------------------------------------------------------------------- */
/* SettingsPageLayout & SettingsSection (Layer C Standard Product Module)     */
/* -------------------------------------------------------------------------- */

export interface SettingsCategoryItem {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface SettingsPageLayoutProps {
  title?: string;
  description?: string;
  categories: SettingsCategoryItem[];
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
  dirty?: boolean;
  saving?: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SettingsPageLayout({
  title = 'Workspace & Account Settings',
  description = 'Configure workspace preferences, governance policies, and integrations.',
  categories,
  activeCategoryId,
  onCategoryChange,
  dirty = false,
  saving = false,
  onSave,
  onDiscard,
  children,
  className,
}: SettingsPageLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary-active" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      {/* Mobile / Tablet category selector */}
      <div className="lg:hidden">
        <label htmlFor="wdr-settings-mobile-cat" className="mb-1.5 block text-xs font-medium text-foreground">
          Settings section
        </label>
        <select
          id="wdr-settings-mobile-cat"
          value={activeCategoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Desktop left section nav */}
        <nav aria-label="Settings sections" className="hidden lg:block lg:col-span-4 xl:col-span-3">
          <ul className="space-y-1">
            {categories.map((cat) => {
              const active = cat.id === activeCategoryId;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onCategoryChange(cat.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] px-3 py-2.5 text-start text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      active
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {cat.icon && <span aria-hidden="true" className="shrink-0">{cat.icon}</span>}
                      <span className="truncate">{cat.label}</span>
                    </span>
                    {cat.badge && (
                      <Badge variant={active ? 'secondary' : 'outline'} size="sm">
                        {cat.badge}
                      </Badge>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-4 lg:col-span-8 xl:col-span-9">{children}</div>
      </div>

      {dirty && (onSave || onDiscard) && (
        <StickyActionBar
          className="rounded-[var(--wdr-radius-md)] border"
          summary="You have unsaved configuration changes."
          secondaryAction={
            onDiscard ? (
              <Button size="sm" variant="outline" disabled={saving} onClick={onDiscard}>
                Discard
              </Button>
            ) : undefined
          }
          primaryAction={
            onSave ? (
              <Button size="sm" variant="primary" loading={saving} onClick={onSave}>
                Save changes
              </Button>
            ) : null
          }
        />
      )}
    </div>
  );
}

export function SettingsSection({
  title,
  description,
  badge,
  children,
  className,
}: {
  title: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {badge && <Badge variant="outline" size="sm">{badge}</Badge>}
      </div>
      <div className="space-y-3">{children}</div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* HelpCenterPanel (Layer C Help & Support Portal — Presentation Only)        */
/* -------------------------------------------------------------------------- */

export interface HelpArticleItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  updatedLabel?: string;
}

export interface HelpFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SupportSubmissionPayload {
  subject: string;
  category: string;
  priority: 'low' | 'normal' | 'urgent';
  details: string;
}

export function HelpCenterPanel({
  title = 'Help & Documentation Portal',
  articles,
  faqs,
  onSubmitTicket,
  className,
}: {
  title?: string;
  articles: HelpArticleItem[];
  faqs: HelpFaqItem[];
  onSubmitTicket?: (payload: SupportSubmissionPayload) => void;
  className?: string;
}) {
  const [query, setQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [selectedArticleId, setSelectedArticleId] = React.useState<string | null>(articles[0]?.id ?? null);
  const [subject, setSubject] = React.useState('');
  const [ticketCategory, setTicketCategory] = React.useState('General');
  const [priority, setPriority] = React.useState<'low' | 'normal' | 'urgent'>('normal');
  const [details, setDetails] = React.useState('');
  const [submittedNotice, setSubmittedNotice] = React.useState(false);

  const categories = React.useMemo(
    () => ['all', ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles]
  );

  const filteredArticles = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (!q) return true;
      return `${a.title} ${a.summary} ${a.content} ${a.category}`.toLowerCase().includes(q);
    });
  }, [articles, activeCategory, query]);

  const selectedArticle =
    filteredArticles.find((a) => a.id === selectedArticleId) ?? filteredArticles[0] ?? null;

  return (
    <div className={cn('space-y-6', className)}>
      <Card className="p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-primary-active" aria-hidden="true" />
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search help articles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides & FAQs…"
              className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface ps-8 pe-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Help article categories">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? 'primary' : 'outline'}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'All topics' : cat}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="p-4 space-y-3 lg:col-span-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Guides ({filteredArticles.length})</span>
          </div>
          {filteredArticles.length === 0 ? (
            <EmptyState
              title="No matching articles"
              description="Try a different keyword or select another topic."
            />
          ) : (
            <ul className="space-y-2">
              {filteredArticles.map((art) => {
                const selected = selectedArticle?.id === art.id;
                return (
                  <li key={art.id}>
                    <button
                      type="button"
                      aria-current={selected ? 'true' : undefined}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={cn(
                        'w-full rounded-[var(--wdr-radius-md)] border p-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        selected
                          ? 'border-foreground bg-primary-subtle/40'
                          : 'border-border bg-surface hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground">{art.title}</span>
                        <Badge variant="outline" size="sm">{art.category}</Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{art.summary}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-5 space-y-3 lg:col-span-7">
          {selectedArticle ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h4 className="text-base font-semibold text-foreground">{selectedArticle.title}</h4>
                  {selectedArticle.updatedLabel && (
                    <p className="text-[11px] text-muted-foreground">Updated {selectedArticle.updatedLabel}</p>
                  )}
                </div>
                <Badge variant="secondary" size="sm">{selectedArticle.category}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {selectedArticle.content}
              </p>
            </>
          ) : (
            <EmptyState title="Select a guide" description="Choose an article to read full guidance." />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <HelpCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>Frequently Asked Questions</span>
          </div>
          <Accordion type="single" defaultValue={faqs[0]?.id}>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {onSubmitTicket && (
          <Card className="p-5 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Submit a support request</h4>
            {submittedNotice && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-[var(--wdr-radius-sm)] border border-success/40 bg-success-subtle px-3 py-2 text-xs text-success-subtle-foreground"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Support request dispatched to host handler.</span>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!subject.trim() || !details.trim()) return;
                onSubmitTicket({
                  subject: subject.trim(),
                  category: ticketCategory,
                  priority,
                  details: details.trim(),
                });
                setSubject('');
                setDetails('');
                setSubmittedNotice(true);
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label htmlFor="wdr-help-subject" className="block font-medium text-foreground">
                  Subject
                </label>
                <input
                  id="wdr-help-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setSubmittedNotice(false);
                  }}
                  placeholder="Briefly describe your request…"
                  className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-xs text-foreground"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="wdr-help-cat" className="block font-medium text-foreground">
                    Category
                  </label>
                  <select
                    id="wdr-help-cat"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 text-xs text-foreground"
                  >
                    <option value="General">General</option>
                    <option value="Account & Access">Account & Access</option>
                    <option value="Billing">Billing</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="wdr-help-priority" className="block font-medium text-foreground">
                    Priority
                  </label>
                  <select
                    id="wdr-help-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'urgent')}
                    className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 text-xs text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="wdr-help-details" className="block font-medium text-foreground">
                  Details
                </label>
                <textarea
                  id="wdr-help-details"
                  rows={3}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide steps, workspace context, or order references…"
                  className="w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface p-2.5 text-xs text-foreground"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm" variant="primary">
                  Submit request
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
