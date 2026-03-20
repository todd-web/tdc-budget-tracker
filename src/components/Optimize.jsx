import { useMemo } from 'react';
import { useBudget } from '../store/BudgetContext';
import { GRAND_TOTAL } from '../data/budgetStructure';
import { formatCurrency, sumExpenses, getPercentage } from '../utils/helpers';
import { Lightbulb, TrendingDown, AlertTriangle, CheckCircle, DollarSign, ArrowRight } from 'lucide-react';

const PRIORITY_LEVELS = {
  high: { label: 'High Impact', color: '#D93636', bg: '#FEF2F2' },
  medium: { label: 'Medium Impact', color: '#E5A100', bg: '#FFFBEB' },
  low: { label: 'Low Impact', color: '#2BB673', bg: '#F0FDF4' },
};

export default function Optimize() {
  const { expenses, categories } = useBudget();
  const totalSpent = sumExpenses(expenses);

  // Generate recommendations based on actual data
  const recommendations = useMemo(() => {
    const recs = [];

    // Workable: Monthly vs Annual
    const workableExpenses = expenses.filter(e => e.itemId === 'workable');
    const workableSpent = sumExpenses(workableExpenses);
    if (workableSpent > 0) {
      recs.push({
        id: 'workable-annual',
        title: 'Transition Workable to Annual Billing',
        priority: 'high',
        category: 'Recruitment',
        currentCost: '$575/month = $6,900/year',
        optimizedCost: '$3,588/year (annual plan)',
        savings: '$3,312/year (48% savings)',
        status: 'in-progress',
        detail: 'Workable is currently billed monthly at $575. The strategic plan budgeted $3,588 for an annual license. An invoice (WBL-202030603) is pending for the annual transition due March 24. Ensure the monthly billing is cancelled and the February refund is processed.',
        action: 'Confirm annual invoice payment by March 24. Verify February $575 refund has been processed.',
      });
    }

    // ChatGPT Pro: Already cancelled
    recs.push({
      id: 'chatgpt-cancelled',
      title: 'ChatGPT Pro Subscription Cancelled',
      priority: 'low',
      category: 'Operational',
      currentCost: '$0/month (cancelled)',
      optimizedCost: 'Saved $200/month',
      savings: '$2,000 saved for remainder of 2026',
      status: 'complete',
      detail: 'ChatGPT Pro was cancelled after February 2026. Total cost for 2026: $400 (Jan + Feb only). Original annual budget was $2,400. Net savings of $2,000.',
      action: 'No action needed. Already saving $200/month.',
    });

    // Streak CRM: Monthly vs Annual
    recs.push({
      id: 'streak-annual',
      title: 'Verify Streak CRM Billing Cycle',
      priority: 'medium',
      category: 'Operational',
      currentCost: 'Plus plan, 2 seats (billing under Nakeya)',
      optimizedCost: 'Check if annual billing available',
      savings: 'Potential 10-20% savings on annual plan',
      status: 'needs-review',
      detail: 'Streak CRM is billed under Nakeya\'s account. The strategic plan notes it is "currently on monthly" billing at $69/user/month. If annual billing offers a discount (typical 10-20% for SaaS), switching could save $200-$400/year.',
      action: 'Ask Nakeya to check if Streak offers annual billing discounts. Current cost: $69 x 2 users x 12 months = $1,656/year.',
    });

    // Wispr Flow: New tool evaluation
    recs.push({
      id: 'wispr-evaluate',
      title: 'Evaluate Wispr Flow ROI Before Committing',
      priority: 'medium',
      category: 'Operational',
      currentCost: '~$20/month',
      optimizedCost: 'Cancel if ROI not proven by Q2',
      savings: '$160 potential savings (Apr-Dec)',
      status: 'monitoring',
      detail: 'Wispr Flow was added in February as a test. Todd forwarded the receipt to Kyle for approval. Before committing long-term, evaluate whether it delivers measurable productivity gains vs. the monthly cost.',
      action: 'Set Q2 review date. Document usage metrics. If not used weekly, cancel.',
    });

    // Background Checks: Volume optimization
    recs.push({
      id: 'background-volume',
      title: 'Negotiate Volume Pricing for Background Checks',
      priority: 'medium',
      category: 'Operational',
      currentCost: '$69/check (pay-per-use)',
      optimizedCost: 'Volume discount at 50+ checks',
      savings: 'Potential 15-25% discount = $500-$1,700/year',
      status: 'needs-review',
      detail: 'With 1,500 new onboardings targeted in 2026, even selective screening (10% rate) means 150 checks at $69 = $10,350. At scale, most background check providers offer volume discounts. Universal Background Screening should be contacted about enterprise/volume pricing.',
      action: 'Contact Universal Background Screening sales team. Request volume pricing for 100+ annual checks.',
    });

    // Conference Budget: Early bird and group discounts
    recs.push({
      id: 'conference-early',
      title: 'Book Conference Registrations Early',
      priority: 'low',
      category: 'Recruitment',
      currentCost: '$868 budgeted for conferences',
      optimizedCost: 'Early bird pricing: 20-30% savings',
      savings: '$170-$260 potential savings',
      status: 'ongoing',
      detail: 'Conference budgets have ranges ($145-$355 for Q1, $535-$670 for Q2). Early bird registration typically saves 20-30%. For recurring conferences, look for exhibitor/partner discounts through TDC\'s retail partner relationships.',
      action: 'Register for Q2 conferences (NRA Show, Smart Home Expo) at early bird rates. Check if TDC retail partners offer exhibitor passes.',
    });

    // Consolidate AI tools
    recs.push({
      id: 'ai-consolidation',
      title: 'Consolidate AI Tool Subscriptions',
      priority: 'medium',
      category: 'Operational',
      currentCost: 'Jace AI ($200/yr) + Wispr Flow (~$240/yr) + AI testing budget ($750)',
      optimizedCost: 'Consolidate to 1-2 proven tools',
      savings: '$200-$500/year by eliminating underused tools',
      status: 'needs-review',
      detail: 'The team has Jace AI, Wispr Flow, and a $750 Q1 budget for testing 4-6 more tools. After Q1 testing, consolidate to the 1-2 tools that deliver the most value. Avoid "subscription creep" where small monthly costs add up.',
      action: 'Complete Q1 AI tool evaluations. Rank by ROI. Cancel bottom 50% before Q2 budget kicks in.',
    });

    // PeopleLooker: Annual discount
    recs.push({
      id: 'peoplelooker-annual',
      title: 'Confirm PeopleLooker Annual Discount',
      priority: 'low',
      category: 'Operational',
      currentCost: '$240/year',
      optimizedCost: 'Annual discount pricing',
      savings: 'Potential $40-$60/year',
      status: 'needs-review',
      detail: 'The strategic plan notes "looking into annual discount" for PeopleLooker. This is under Nakeya\'s account.',
      action: 'Ask Nakeya to check current billing cycle and available discounts.',
    });

    return recs;
  }, [expenses]);

  const totalPotentialSavings = 3312 + 2000; // Workable annual + ChatGPT cancelled
  const completedSavings = 2000; // ChatGPT cancelled

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-tdc-gray-800">Budget Optimization</h2>
          <p className="text-sm text-tdc-gray-500">Recommendations to reduce costs and maximize budget efficiency</p>
        </div>
      </div>

      {/* Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-tdc-green/10 border border-tdc-green/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-tdc-green" />
            <span className="text-xs font-medium text-tdc-green uppercase">Realized Savings</span>
          </div>
          <div className="text-2xl font-bold text-tdc-gray-900">{formatCurrency(completedSavings)}</div>
          <div className="text-xs text-tdc-gray-500 mt-1">ChatGPT Pro cancelled after Feb</div>
        </div>
        <div className="bg-tdc-gold/10 border border-tdc-gold/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-tdc-gold-dark" />
            <span className="text-xs font-medium text-tdc-gold-dark uppercase">Potential Savings</span>
          </div>
          <div className="text-2xl font-bold text-tdc-gray-900">{formatCurrency(totalPotentialSavings)}</div>
          <div className="text-xs text-tdc-gray-500 mt-1">If all recommendations implemented</div>
        </div>
        <div className="bg-white border border-tdc-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-tdc-gray-500" />
            <span className="text-xs font-medium text-tdc-gray-500 uppercase">Active Recommendations</span>
          </div>
          <div className="text-2xl font-bold text-tdc-gray-900">{recommendations.filter(r => r.status !== 'complete').length}</div>
          <div className="text-xs text-tdc-gray-500 mt-1">{recommendations.filter(r => r.priority === 'high').length} high priority</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map(rec => {
          const priority = PRIORITY_LEVELS[rec.priority];
          return (
            <div key={rec.id} className="bg-white rounded-xl border border-tdc-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {rec.status === 'complete' ? (
                      <CheckCircle size={20} className="text-tdc-green" />
                    ) : rec.priority === 'high' ? (
                      <AlertTriangle size={20} className="text-tdc-red" />
                    ) : (
                      <Lightbulb size={20} className="text-tdc-gold" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-tdc-gray-900">{rec.title}</h3>
                    <span className="text-xs text-tdc-gray-500">{rec.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: priority.bg, color: priority.color }}>
                    {priority.label}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    rec.status === 'complete' ? 'bg-green-50 text-tdc-green' :
                    rec.status === 'in-progress' ? 'bg-blue-50 text-tdc-gold' :
                    rec.status === 'monitoring' ? 'bg-purple-50 text-purple-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {rec.status === 'complete' ? 'Done' :
                     rec.status === 'in-progress' ? 'In Progress' :
                     rec.status === 'monitoring' ? 'Monitoring' :
                     'Needs Review'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="bg-tdc-gray-50 rounded-lg p-2.5">
                  <div className="text-xs text-tdc-gray-500">Current</div>
                  <div className="text-sm font-medium">{rec.currentCost}</div>
                </div>
                <div className="bg-tdc-gray-50 rounded-lg p-2.5 flex items-center">
                  <ArrowRight size={14} className="text-tdc-gray-400 mr-2" />
                  <div>
                    <div className="text-xs text-tdc-gray-500">Optimized</div>
                    <div className="text-sm font-medium">{rec.optimizedCost}</div>
                  </div>
                </div>
                <div className="bg-tdc-green/5 rounded-lg p-2.5">
                  <div className="text-xs text-tdc-green">Savings</div>
                  <div className="text-sm font-bold text-tdc-green">{rec.savings}</div>
                </div>
              </div>

              <p className="text-sm text-tdc-gray-600 mb-2">{rec.detail}</p>
              <div className="flex items-start gap-2 bg-tdc-gold/5 rounded-lg p-2.5 border border-tdc-gold/10">
                <ArrowRight size={14} className="text-tdc-gold-dark mt-0.5 shrink-0" />
                <span className="text-sm text-tdc-gray-700"><strong>Action:</strong> {rec.action}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
