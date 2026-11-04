import { PolicyRuleConfig, PolicyVerdict, PolicyViolation, Product } from '../types';

export const DEFAULT_POLICY_CONFIG: PolicyRuleConfig = {
  autoApprovalMaxINR: 5000,
  requireApprovalMaxINR: 15000,
  categoryRestrictionsEnabled: false,
  blockedCategories: [],
  requireDualConfirmationForOverINR: 10000,
};

export class DeterministicPolicyEngine {
  private config: PolicyRuleConfig;

  constructor(customConfig?: Partial<PolicyRuleConfig>) {
    this.config = { ...DEFAULT_POLICY_CONFIG, ...customConfig };
  }

  public updateConfig(newConfig: Partial<PolicyRuleConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): PolicyRuleConfig {
    return { ...this.config };
  }

  /**
   * Deterministically evaluates an order against spending policies, mission budgets,
   * and security rules. An LLM cannot override or bypass this function.
   */
  public evaluateOrder(params: {
    product: Product;
    missionBudgetINR: number;
    userSpendingLimitINR: number;
    currentLedgerTotalINR?: number;
  }): PolicyVerdict {
    const { product, missionBudgetINR, userSpendingLimitINR, currentLedgerTotalINR = 0 } = params;
    const orderTotalINR = product.priceINR;
    const violations: PolicyViolation[] = [];
    const now = new Date().toISOString();

    const cumulativeSpend = currentLedgerTotalINR + orderTotalINR;
    const remainingSpendingLimit = Math.max(0, userSpendingLimitINR - cumulativeSpend);
    const missionBudgetHeadroom = missionBudgetINR - orderTotalINR;

    // RULE 1: Hard User Spending Limit Breach
    if (orderTotalINR > userSpendingLimitINR) {
      violations.push({
        code: 'EXCEEDS_GLOBAL_LIMIT',
        severity: 'BLOCK',
        message: `Order total (₹${orderTotalINR.toLocaleString('en-IN')}) exceeds your total spending limit (₹${userSpendingLimitINR.toLocaleString('en-IN')}).`,
      });
    }

    // RULE 2: Exceeds Mission-Specific Budget
    if (missionBudgetINR > 0 && orderTotalINR > missionBudgetINR) {
      violations.push({
        code: 'EXCEEDS_MISSION_BUDGET',
        severity: 'BLOCK',
        message: `Order total (₹${orderTotalINR.toLocaleString('en-IN')}) exceeds your mission budget target of ₹${missionBudgetINR.toLocaleString('en-IN')} by ₹${(orderTotalINR - missionBudgetINR).toLocaleString('en-IN')}.`,
      });
    }

    // RULE 3: Category Restriction Check
    if (this.config.categoryRestrictionsEnabled && this.config.blockedCategories.includes(product.category)) {
      violations.push({
        code: 'RESTRICTED_CATEGORY',
        severity: 'BLOCK',
        message: `Category "${product.category}" is restricted under your active spending governance rules.`,
      });
    }

    // RULE 4: Absolute Hard Cap Breach
    if (orderTotalINR > this.config.requireApprovalMaxINR) {
      violations.push({
        code: 'EXCEEDS_MAX_APPROVAL_CEILING',
        severity: 'BLOCK',
        message: `Order amount (₹${orderTotalINR.toLocaleString('en-IN')}) exceeds the maximum transaction ceiling of ₹${this.config.requireApprovalMaxINR.toLocaleString('en-IN')}.`,
      });
    }

    // If any BLOCK severity violation was triggered, the verdict is BLOCKED
    const hasBlock = violations.some((v) => v.severity === 'BLOCK');
    if (hasBlock) {
      return {
        status: 'BLOCKED',
        primaryReason: violations.find((v) => v.severity === 'BLOCK')?.message || 'Transaction violates spending policy rules.',
        orderTotalINR,
        budgetHeadroomINR: missionBudgetHeadroom,
        violations,
        evaluatedAt: now,
        requiresUserSignature: false,
      };
    }

    // RULE 5: Approval Required Range (Between Auto-Approval Max and Upper Ceiling)
    if (orderTotalINR > this.config.autoApprovalMaxINR) {
      const requiresSignature = orderTotalINR >= this.config.requireDualConfirmationForOverINR;
      violations.push({
        code: 'HIGH_VALUE_THRESHOLD',
        severity: 'WARNING',
        message: `Order amount is above the automatic approval limit of ₹${this.config.autoApprovalMaxINR.toLocaleString('en-IN')}. Explicit human authorization required.`,
      });

      return {
        status: 'APPROVAL_REQUIRED',
        primaryReason: `Order amount (₹${orderTotalINR.toLocaleString('en-IN')}) exceeds automatic clearance threshold. Explicit user approval is required before payment authorization.`,
        orderTotalINR,
        budgetHeadroomINR: missionBudgetHeadroom,
        violations,
        evaluatedAt: now,
        requiresUserSignature: requiresSignature,
      };
    }

    // If no blocks and within auto-approval threshold: ALLOWED
    return {
      status: 'ALLOWED',
      primaryReason: `Transaction is strictly within your pre-cleared auto-spending policy limit (₹${this.config.autoApprovalMaxINR.toLocaleString('en-IN')}) and mission budget.`,
      orderTotalINR,
      budgetHeadroomINR: missionBudgetHeadroom,
      violations: [],
      evaluatedAt: now,
      requiresUserSignature: false,
    };
  }
}

export const defaultPolicyEngine = new DeterministicPolicyEngine();
