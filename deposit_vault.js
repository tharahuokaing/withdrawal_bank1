/**
 * HUOKAING THARA - Audit Vault Controller
 * Manages manual placement entries and syncs with the Ledger Engine.
 */

(() => {
    "use strict";

    const AuditVault = {
        /**
         * Injects a new placement record into the system ledger.
         * @param {string} refId - Transaction Reference ID.
         * @param {string} tier - Asset Tier (e.g., Corporate, VIP).
         * @param {string} route - Routing method (e.g., WIRE, FAST).
         * @param {string} amount - The raw amount to be processed.
         */
        addPlacement: function(refId, tier, route, amount) {
            // 1. Sanitize and Format
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                alert("Invalid amount. Please check your input.");
                return;
            }

            // 2. Build Entry Object
            const newEntry = {
                id: refId || "REF-" + Math.floor(Math.random() * 1000),
                tier: tier || "General",
                route: route || "Manual",
                volume: `$${numericAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
                status: "Success"
            };

            // 3. Sync with Ledger Engine
            if (window.LedgerEngine) {
                window.LedgerEngine.addEntry(newEntry);
                console.log(`[AUDIT VAULT]: Successfully recorded ${newEntry.id}.`);
            } else {
                console.error("[AUDIT VAULT]: Critical Error - LedgerEngine not found.");
            }
        }
    };

    // Expose to window for UI accessibility
    window.addVaultRecord = AuditVault.addPlacement;
})();
