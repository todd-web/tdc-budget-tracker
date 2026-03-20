// TDC Expert Team 2026 Budget Structure
// Source: 2026 Expert Team Strategic Plan v2 (12/8/2025)
// Updated 2026-03-20 with VERIFIED data from TDC email receipts and invoices
// Vetting tools (background checks, PeopleLooker) removed per Todd - those are fulfillment/PM budget
// SXSW removed - declined by executives for 2026

export const BUDGET_YEAR = 2026;

export const CATEGORIES = [
  {
    id: 'operational',
    name: 'Operational',
    color: '#A48450',
    description: 'Platform management, automation, and team enablement',
    subcategories: [
      {
        id: 'op-platforms',
        name: 'Operational Platforms',
        items: [
          { id: 'streak-crm', name: 'Streak CRM', budget: 1656, period: 'annual', notes: 'Plus plan, 2 seats. Billed under Nakeya. $69 x 2 users x 12 months.', monthlyAmount: 138 },
          { id: 'jace-ai', name: 'Jace.AI', budget: 200, period: 'annual', notes: 'Monthly receipts confirmed Jan-Mar 2026' },
          { id: 'chatgpt-pro', name: 'ChatGPT Pro (Ended)', budget: 400, period: 'annual', notes: 'STOPPED after February 2026. Only Jan + Feb charged at $200/mo.', monthlyAmount: 200, stoppedDate: '2026-02-28' },
          { id: 'claude-ai', name: 'Claude (Potential)', budget: 0, period: 'annual', notes: 'Evaluating as AI platform. Budget TBD.', isTBD: true },
          { id: 'wispr-flow', name: 'Wispr Flow', budget: 240, period: 'annual', notes: 'New tool since Feb 2026. Receipts confirmed.', monthlyAmount: 20, isNew: true },
        ]
      },
      {
        id: 'op-automation',
        name: 'Automation Tool Testing',
        items: [
          { id: 'auto-q1-pilot', name: 'Q1 Pilot', budget: 500, period: 'quarter', quarter: 1, notes: 'Test operational value' },
          { id: 'auto-q2-expand', name: 'Q2 Expansion', budget: 250, period: 'quarter', quarter: 2, notes: 'Scale based on Q1 performance' },
        ]
      },
      {
        id: 'op-enablement',
        name: 'Team Enablement',
        items: [
          { id: 'ld-certifications', name: 'L&D / Additional Certifications', budget: 1500, period: 'annual', notes: 'Professional development trainings' },
          { id: 'process-docs', name: 'Internal Process Documenting Tools', budget: 0, period: 'annual', notes: 'TBD - not yet allocated', isTBD: true },
        ]
      },
    ]
  },
  {
    id: 'recruitment',
    name: 'Recruitment',
    color: '#404752',
    description: 'Platforms, conferences, paid ads, and rapid response sourcing',
    subcategories: [
      {
        id: 'rec-platforms',
        name: 'Recruitment Platforms',
        items: [
          { id: 'workable', name: 'Workable', budget: 5454, period: 'annual', notes: 'Annual invoice WBL-202030603 = $5,453.98 due 3/24/2026. Jan $555 + Feb $575 monthly (Feb refund pending).', invoiceAmount: 5453.98 },
          { id: 'backstage', name: 'Backstage', budget: 0, period: 'annual', notes: 'Free creator-focused pipeline' },
          { id: 'new-platform-test', name: 'New Platform Testing (1-2 tools)', budget: 750, period: 'annual', notes: 'Budget for experimentation' },
        ]
      },
      {
        id: 'rec-conferences',
        name: 'Conferences',
        items: [
          { id: 'conf-q1', name: 'Q1 Conferences', budget: 250, period: 'quarter', quarter: 1, notes: 'Auto Show, PHCC Expo, Inspired Home, C2E2 ($145-$355). No spend yet.', budgetLow: 145, budgetHigh: 355 },
          { id: 'conf-q2', name: 'Q2 Conferences', budget: 600, period: 'quarter', quarter: 2, notes: 'Food as Medicine, NRA Show, Smart Home Expo, Automate ($535-$670)', budgetLow: 535, budgetHigh: 670 },
          { id: 'conf-q3', name: 'Q3 Conferences', budget: 0, period: 'quarter', quarter: 3, notes: 'None scheduled', isTBD: true },
          { id: 'conf-q4', name: 'Q4 Conferences', budget: 18, period: 'quarter', quarter: 4, notes: 'Chicago Build (free), Women\'s Expo ($15-$20)', budgetLow: 15, budgetHigh: 20 },
        ]
      },
      {
        id: 'rec-paid-ads',
        name: 'Paid Ads - Lead Generation',
        items: [
          { id: 'ads-q1-pilot', name: 'Q1 Pilot', budget: 1000, period: 'quarter', quarter: 1, notes: 'Test messaging + channels. No spend yet.' },
          { id: 'ads-q2-expand', name: 'Q2 Expansion', budget: 0, period: 'quarter', quarter: 2, notes: 'TBD - Scale based on Q1 performance', isTBD: true },
        ]
      },
      {
        id: 'rec-rapid-response',
        name: 'Rapid Response Recruitment',
        items: [
          { id: 'freelance-pool', name: 'Freelance Recruiter Pool', budget: 0, period: 'annual', notes: 'As-needed for volume spikes or niche categories', isTBD: true },
          { id: 'bounty-program', name: 'Critical Need Bounty Program (Pilot)', budget: 0, period: 'annual', notes: 'Premium incentive for hard-to-fill roles', isTBD: true },
        ]
      },
    ]
  },
  {
    id: 'engagement',
    name: 'Engagement',
    color: '#1A1A1A',
    description: 'In-person events, digital engagement, AI tools, and community programming',
    subcategories: [
      {
        id: 'eng-q1',
        name: 'Q1 Engagement',
        quarterBudget: 1950,
        items: [
          { id: 'office-hours-q1', name: 'Office Hours (Q1)', budget: 200, period: 'quarter', quarter: 1, notes: 'March 25 at 2112. Budget $200. No spend yet.' },
          { id: 'ai-tools-test', name: 'AI Tools Test (4-6 tools)', budget: 750, period: 'quarter', quarter: 1, notes: 'Paid trials + test access' },
          { id: 'survey-tools', name: 'Survey Tools', budget: 0, period: 'quarter', quarter: 1, notes: 'Existing platform' },
          { id: 'ld-pilot', name: 'Expert L&D Programming Pilot', budget: 1000, period: 'quarter', quarter: 1, notes: 'Professional growth content & programming' },
        ]
      },
      {
        id: 'eng-q2',
        name: 'Q2 Engagement',
        quarterBudget: 1450,
        items: [
          { id: 'community-sponsor', name: 'Community Sponsorship Opportunity', budget: 1000, period: 'quarter', quarter: 2, notes: 'Event sponsorship' },
          { id: 'office-hours-q2', name: 'Office Hours (Q2)', budget: 200, period: 'quarter', quarter: 2, notes: 'Budget $200' },
          { id: 'ai-tool-integration', name: 'AI Tool Integration (1-2 tools)', budget: 250, period: 'quarter', quarter: 2, notes: 'Extended use + integration' },
        ]
      },
      {
        id: 'eng-q3',
        name: 'Q3 Engagement',
        quarterBudget: 0,
        items: [
          { id: 'office-hours-q3', name: 'Office Hours (Q3)', budget: 0, period: 'quarter', quarter: 3, notes: 'TBD - pending H1 review', isTBD: true },
        ]
      },
      {
        id: 'eng-q4',
        name: 'Q4 Engagement',
        quarterBudget: 0,
        items: [
          { id: 'office-hours-q4', name: 'Office Hours (Q4)', budget: 0, period: 'quarter', quarter: 4, notes: 'TBD - pending H1 review', isTBD: true },
        ]
      },
    ]
  }
];

// Compute totalBudget dynamically from line items
for (const cat of CATEGORIES) {
  cat.totalBudget = cat.subcategories.reduce((catSum, sub) =>
    catSum + sub.items.reduce((subSum, item) => subSum + item.budget, 0), 0);
}

export const GRAND_TOTAL = CATEGORIES.reduce((sum, cat) => sum + cat.totalBudget, 0);

export const PAYMENT_METHODS = [
  { id: 'credit-card', name: 'Credit Card' },
  { id: 'debit-card', name: 'Debit Card' },
  { id: 'bank-transfer', name: 'Bank Transfer' },
  { id: 'check', name: 'Check' },
  { id: 'cash', name: 'Cash' },
  { id: 'invoice', name: 'Invoice / PO' },
  { id: 'auto-payment', name: 'Auto-Payment' },
  { id: 'other', name: 'Other' },
];

export const EXPENSE_STATUSES = [
  { id: 'pending', name: 'Pending', color: '#A48450' },
  { id: 'approved', name: 'Approved', color: '#404752' },
  { id: 'reimbursed', name: 'Reimbursed', color: '#000000' },
  { id: 'denied', name: 'Denied', color: '#A5A6A5' },
];

export function getAllBudgetItems() {
  const items = [];
  for (const cat of CATEGORIES) {
    for (const sub of cat.subcategories) {
      for (const item of sub.items) {
        items.push({ ...item, categoryId: cat.id, categoryName: cat.name, subcategoryId: sub.id, subcategoryName: sub.name, categoryColor: cat.color });
      }
    }
  }
  return items;
}

// VERIFIED expenses ONLY from TDC email receipts/invoices
export const SAMPLE_EXPENSES = [
  { id: '1', date: '2026-01-03', categoryId: 'recruitment', subcategoryId: 'rec-platforms', itemId: 'workable', projectId: null, amount: 555, vendor: 'Workable', description: 'January - Standard Recruiting monthly', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring', 'verified'] },
  { id: '2', date: '2026-02-28', categoryId: 'recruitment', subcategoryId: 'rec-platforms', itemId: 'workable', projectId: null, amount: 575, vendor: 'Workable', description: 'February - Standard Recruiting monthly (refund pending)', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring', 'verified', 'refund-pending'] },
  { id: '3', date: '2026-01-01', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'chatgpt-pro', projectId: null, amount: 200, vendor: 'OpenAI', description: 'January ChatGPT Pro', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring'] },
  { id: '4', date: '2026-02-01', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'chatgpt-pro', projectId: null, amount: 200, vendor: 'OpenAI', description: 'February ChatGPT Pro (FINAL)', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring', 'final'] },
  { id: '5', date: '2026-01-03', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'jace-ai', projectId: null, amount: 17, vendor: 'Jace AI', description: 'January (receipt #2692-2076)', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring', 'verified'] },
  { id: '6', date: '2026-02-04', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'jace-ai', projectId: null, amount: 17, vendor: 'Jace AI', description: 'February (receipt #2425-4998)', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring', 'verified'] },
  { id: '7', date: '2026-03-02', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'jace-ai', projectId: null, amount: 17, vendor: 'Jace AI', description: 'March (receipt #2788-6658)', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring', 'verified'] },
  { id: '8', date: '2026-02-22', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'wispr-flow', projectId: null, amount: 20, vendor: 'Wispr Flow', description: 'February (receipt #2453-3488)', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring', 'verified'] },
  { id: '9', date: '2026-03-21', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'wispr-flow', projectId: null, amount: 20, vendor: 'Wispr Flow', description: 'March auto-renewal', paymentMethod: 'auto-payment', status: 'pending', receiptId: null, tags: ['recurring'] },
];

export const SAMPLE_PROJECTS = [
  { id: 'proj-office-hours-q1', name: 'Expert Office Hours Q1', categoryId: 'engagement', budget: 200, description: 'Q1 2026 Office Hours at 2112 + Happy Hour. March 25.', startDate: '2026-03-25', endDate: '2026-03-25', status: 'active' },
  { id: 'proj-bentonville', name: 'Bentonville Recruitment Blitz', categoryId: 'recruitment', budget: 0, description: 'Executive-mandated NW Arkansas expert recruiting sprint. Budget TBD.', startDate: '2026-03-16', endDate: null, status: 'active' },
  { id: 'proj-q1-ads', name: 'Q1 Paid Ads Pilot', categoryId: 'recruitment', budget: 1000, description: 'Test messaging and channels. No spend yet.', startDate: '2026-01-15', endDate: '2026-03-31', status: 'active' },
];
