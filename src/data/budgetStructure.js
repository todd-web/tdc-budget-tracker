// TDC Expert Team 2026 Budget Structure
// Source: 2026 Expert Team Strategic Plan v2 (12/8/2025)

export const BUDGET_YEAR = 2026;

export const CATEGORIES = [
  {
    id: 'operational',
    name: 'Operational',
    color: '#2563eb',
    totalBudget: 6750,
    description: 'Platform management, vetting, automation, and team enablement',
    subcategories: [
      {
        id: 'op-platforms',
        name: 'Operational Platforms',
        items: [
          { id: 'streak-crm', name: 'Streak CRM', budget: 1656, period: 'annual', notes: '$69 x 2 users x 12 months (currently on monthly)', monthlyAmount: 138 },
          { id: 'jace-ai', name: 'Jace.AI', budget: 200, period: 'annual', notes: 'Annual plan for 2 users' },
          { id: 'chatgpt-pro', name: 'ChatGPT Pro', budget: 2400, period: 'annual', notes: '$200/month for 1 account', monthlyAmount: 200 },
        ]
      },
      {
        id: 'op-vetting',
        name: 'Vetting Tools',
        items: [
          { id: 'background-check', name: 'Universal Background Check', budget: 690, period: 'annual', notes: '$69/expert - estimated 10 experts', isVariable: true, unitCost: 69, unit: 'expert' },
          { id: 'people-looker', name: 'PeopleLooker.com', budget: 240, period: 'annual', notes: 'Looking into annual discount' },
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
    color: '#10b981',
    totalBudget: 6500,
    description: 'Platforms, conferences, paid ads, and rapid response sourcing',
    subcategories: [
      {
        id: 'rec-platforms',
        name: 'Recruitment Platforms',
        items: [
          { id: 'workable', name: 'Workable Annual License', budget: 3588, period: 'annual', notes: 'Primary recruiting system' },
          { id: 'backstage', name: 'Backstage', budget: 0, period: 'annual', notes: 'Free creator-focused pipeline' },
          { id: 'new-platform-test', name: 'New Platform Testing (1-2 tools)', budget: 750, period: 'annual', notes: 'Budget for experimentation' },
        ]
      },
      {
        id: 'rec-conferences',
        name: 'Conferences',
        items: [
          { id: 'conf-q1', name: 'Q1 Conferences', budget: 250, period: 'quarter', quarter: 1, notes: 'Auto Show, PHCC Expo, Inspired Home, C2E2 (range: $145-$355)', budgetLow: 145, budgetHigh: 355 },
          { id: 'conf-q2', name: 'Q2 Conferences', budget: 600, period: 'quarter', quarter: 2, notes: 'Food as Medicine, NRA Show, Smart Home Expo, Automate (range: $535-$670)', budgetLow: 535, budgetHigh: 670 },
          { id: 'conf-q3', name: 'Q3 Conferences', budget: 0, period: 'quarter', quarter: 3, notes: 'None scheduled', isTBD: true },
          { id: 'conf-q4', name: 'Q4 Conferences', budget: 18, period: 'quarter', quarter: 4, notes: 'Chicago Build (free), Women\'s Expo (range: $15-$20)', budgetLow: 15, budgetHigh: 20 },
        ]
      },
      {
        id: 'rec-paid-ads',
        name: 'Paid Ads - Lead Generation',
        items: [
          { id: 'ads-q1-pilot', name: 'Q1 Pilot', budget: 1000, period: 'quarter', quarter: 1, notes: 'Test messaging + channels' },
          { id: 'ads-q2-expand', name: 'Q2 Expansion', budget: 0, period: 'quarter', quarter: 2, notes: 'TBD - Scale based on Q1 performance', isTBD: true },
        ]
      },
      {
        id: 'rec-rapid-response',
        name: 'Rapid Response Recruitment',
        items: [
          { id: 'freelance-pool', name: 'Freelance Recruiter Pool', budget: 0, period: 'annual', notes: 'As-needed support for volume spikes or niche categories', isTBD: true },
          { id: 'bounty-program', name: 'Critical Need Bounty Program (Pilot)', budget: 0, period: 'annual', notes: 'Premium incentive for time-sensitive hard-to-fill expert roles', isTBD: true },
        ]
      },
    ]
  },
  {
    id: 'engagement',
    name: 'Engagement',
    color: '#8b5cf6',
    totalBudget: 3250,
    description: 'In-person events, digital engagement, AI tools, and community programming',
    subcategories: [
      {
        id: 'eng-q1',
        name: 'Q1 Engagement',
        quarterBudget: 1850,
        items: [
          { id: 'office-hours-q1', name: 'Office Hours (Q1)', budget: 100, period: 'quarter', quarter: 1, notes: 'Light refreshments' },
          { id: 'ai-tools-test', name: 'AI Tools Test (4-6 tools)', budget: 750, period: 'quarter', quarter: 1, notes: 'Paid trials + test access' },
          { id: 'survey-tools', name: 'Survey Tools', budget: 0, period: 'quarter', quarter: 1, notes: 'Existing platform' },
          { id: 'ld-pilot', name: 'Expert L&D Programming Pilot', budget: 1000, period: 'quarter', quarter: 1, notes: 'Professional growth content & programming' },
        ]
      },
      {
        id: 'eng-q2',
        name: 'Q2 Engagement',
        quarterBudget: 1350,
        items: [
          { id: 'community-sponsor', name: 'Community Sponsorship Opportunity', budget: 1000, period: 'quarter', quarter: 2, notes: 'Event sponsorship' },
          { id: 'office-hours-q2', name: 'Office Hours (Q2)', budget: 100, period: 'quarter', quarter: 2, notes: 'Light refreshments' },
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
  { id: 'pending', name: 'Pending', color: '#f59e0b' },
  { id: 'approved', name: 'Approved', color: '#10b981' },
  { id: 'reimbursed', name: 'Reimbursed', color: '#2563eb' },
  { id: 'denied', name: 'Denied', color: '#ef4444' },
];

// Generate a flat list of all budget items for easy lookup
export function getAllBudgetItems() {
  const items = [];
  for (const cat of CATEGORIES) {
    for (const sub of cat.subcategories) {
      for (const item of sub.items) {
        items.push({
          ...item,
          categoryId: cat.id,
          categoryName: cat.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          categoryColor: cat.color,
        });
      }
    }
  }
  return items;
}

// Sample expenses for demo/initial state
export const SAMPLE_EXPENSES = [
  { id: '1', date: '2026-01-01', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'streak-crm', projectId: null, amount: 138, vendor: 'Streak', description: 'January subscription - 2 users', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring'] },
  { id: '2', date: '2026-01-01', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'chatgpt-pro', projectId: null, amount: 200, vendor: 'OpenAI', description: 'January ChatGPT Pro subscription', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring'] },
  { id: '3', date: '2026-02-01', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'streak-crm', projectId: null, amount: 138, vendor: 'Streak', description: 'February subscription - 2 users', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring'] },
  { id: '4', date: '2026-02-01', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'chatgpt-pro', projectId: null, amount: 200, vendor: 'OpenAI', description: 'February ChatGPT Pro subscription', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring'] },
  { id: '5', date: '2026-03-01', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'streak-crm', projectId: null, amount: 138, vendor: 'Streak', description: 'March subscription - 2 users', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring'] },
  { id: '6', date: '2026-03-01', categoryId: 'operational', subcategoryId: 'op-platforms', itemId: 'chatgpt-pro', projectId: null, amount: 200, vendor: 'OpenAI', description: 'March ChatGPT Pro subscription', paymentMethod: 'auto-payment', status: 'approved', receiptId: null, tags: ['recurring'] },
  { id: '7', date: '2026-01-15', categoryId: 'recruitment', subcategoryId: 'rec-platforms', itemId: 'workable', projectId: null, amount: 3588, vendor: 'Workable', description: 'Annual Workable license', paymentMethod: 'invoice', status: 'approved', receiptId: null, tags: ['annual'] },
  { id: '8', date: '2026-02-10', categoryId: 'operational', subcategoryId: 'op-vetting', itemId: 'background-check', projectId: null, amount: 69, vendor: 'Universal Background Screening', description: 'Background check - Expert #2301', paymentMethod: 'credit-card', status: 'approved', receiptId: null, tags: ['per-expert'] },
  { id: '9', date: '2026-02-15', categoryId: 'operational', subcategoryId: 'op-vetting', itemId: 'background-check', projectId: null, amount: 69, vendor: 'Universal Background Screening', description: 'Background check - Expert #2315', paymentMethod: 'credit-card', status: 'approved', receiptId: null, tags: ['per-expert'] },
  { id: '10', date: '2026-03-01', categoryId: 'operational', subcategoryId: 'op-vetting', itemId: 'people-looker', projectId: null, amount: 240, vendor: 'PeopleLooker', description: 'Annual subscription', paymentMethod: 'credit-card', status: 'approved', receiptId: null, tags: ['annual'] },
  { id: '11', date: '2026-03-15', categoryId: 'engagement', subcategoryId: 'eng-q1', itemId: 'office-hours-q1', projectId: 'proj-office-hours-q1', amount: 53, vendor: 'Various', description: 'Snacks for Expert Office Hours event', paymentMethod: 'credit-card', status: 'approved', receiptId: null, tags: ['event'] },
  { id: '12', date: '2026-01-20', categoryId: 'recruitment', subcategoryId: 'rec-conferences', itemId: 'conf-q1', projectId: null, amount: 45, vendor: 'Chicago Auto Show', description: 'Admission tickets x3', paymentMethod: 'credit-card', status: 'approved', receiptId: null, tags: ['conference'] },
  { id: '13', date: '2026-02-05', categoryId: 'recruitment', subcategoryId: 'rec-paid-ads', itemId: 'ads-q1-pilot', projectId: null, amount: 350, vendor: 'Meta Ads', description: 'Expert recruitment campaign - February', paymentMethod: 'credit-card', status: 'approved', receiptId: null, tags: ['paid-ads'] },
  { id: '14', date: '2026-03-05', categoryId: 'recruitment', subcategoryId: 'rec-paid-ads', itemId: 'ads-q1-pilot', projectId: null, amount: 400, vendor: 'Meta Ads', description: 'Expert recruitment campaign - March', paymentMethod: 'credit-card', status: 'approved', receiptId: null, tags: ['paid-ads'] },
];

export const SAMPLE_PROJECTS = [
  { id: 'proj-office-hours-q1', name: 'Expert Office Hours Q1', categoryId: 'engagement', budget: 200, description: 'Q1 2026 Office Hours at 2112 + Happy Hour', startDate: '2026-03-25', endDate: '2026-03-25', status: 'active' },
  { id: 'proj-sxsw', name: 'SXSW 2026 Activation', categoryId: 'engagement', budget: 0, description: 'Cross-functional company opportunity', startDate: '2026-03-07', endDate: '2026-03-15', status: 'planned' },
  { id: 'proj-bentonville', name: 'Bentonville Recruitment Blitz', categoryId: 'recruitment', budget: 0, description: 'Executive-mandated NW Arkansas expert recruiting sprint', startDate: '2026-03-16', endDate: null, status: 'active' },
  { id: 'proj-q1-ads', name: 'Q1 Paid Ads Pilot', categoryId: 'recruitment', budget: 1000, description: 'Test messaging and channels for expert recruitment ads', startDate: '2026-01-15', endDate: '2026-03-31', status: 'active' },
];
