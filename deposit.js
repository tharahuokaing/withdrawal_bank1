/**
 * HUOKAING THARA - Deposit Module (Expanded with UI & Removal)
 * Handles processing of incoming capital, updates the system audit vault, and manages capital totals.
 */

(() => {
    "use strict";

    const DepositHandler = {
        /**
         * Processes a new deposit, updates totals, and renders the audit row.
         * @param {string|number} amount - The numeric value of the deposit.
         * @param {string} route - The source routing method (e.g., "Wire Transfer").
         */
        processDeposit: function(amount, route = "Manual Input") {
            const numericAmount = parseFloat(amount);

            // 1. Validation
            if (isNaN(numericAmount) || numericAmount <= 0) {
                alert("Invalid transaction: Please enter a positive numerical amount.");
                return;
            }

            const referenceId = "DEP-" + Math.floor(Math.random() * 10000);

            // 2. Prepare Transaction Data Object
            const newEntry = {
                id: referenceId,
                tier: "Retail Pool",
                route: route,
                volume: numericAmount,
                status: "Success"
            };

            // 3. Update Audit Vault via LedgerEngine if available, else direct DOM injection
            if (window.LedgerEngine && typeof window.LedgerEngine.addEntry === "function") {
                window.LedgerEngine.addEntry({
                    id: newEntry.id,
                    tier: newEntry.tier,
                    route: newEntry.route,
                    volume: `$${numericAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
                    status: newEntry.status
                });
            } else {
                this.appendDepositRow(newEntry.id, newEntry.route, numericAmount);
            }

            // 4. Update Main System Capital Balance Total
            this.updateSystemCapital(numericAmount);

            console.log(`[DEPOSIT SUCCESS]: Successfully processed $${numericAmount.toFixed(2)}.`);
        },

        /**
         * Helper to dynamically append a deposit row with a Success badge and a Remove button.
         */
        appendDepositRow: function(id, route, amount) {
            const tbody = document.getElementById("depositLogBody");
            if (!tbody) return;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${id}</td>
                <td>Retail Pool</td>
                <td>${route}</td>
                <td class="item-amount">$${amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td>
                    <span class="status-badge" style="background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-right: 6px;">Success</span>
                    <button class="btn-remove-row" style="background: #f6465d; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">Remove</button>
                </td>
            `;
            tbody.prepend(row);
        },

        /**
         * Adds incoming deposit amount back into the main system liquid capital display.
         */
        updateSystemCapital: function(amount) {
            const totalDisplayEl = document.getElementById("displayTotalDeposits");
            if (totalDisplayEl) {
                let currentTotalText = totalDisplayEl.textContent.replace(/[^0-9.-]+/g, "");
                let currentTotal = parseFloat(currentTotalText) || 0;
                let newTotal = currentTotal + amount; // Deposits add to total capital
                totalDisplayEl.textContent = `$${newTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            }
        }
    };

    // Expose to window for UI buttons
    window.DepositHandler = DepositHandler;

    /**
     * Global Event Listener to handle row removal and capital rollback for deposit records
     */
    document.addEventListener("DOMContentLoaded", () => {
        document.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains("btn-remove-row")) {
                const row = e.target.closest("tr");
                if (row) {
                    const amountCell = row.querySelector(".item-amount");
                    if (amountCell) {
                        const rawVal = amountCell.textContent.replace(/[^0-9.-]+/g, "");
                        const val = parseFloat(rawVal) || 0;
                        
                        // Deduct removed deposit amount back from system balance
                        const totalDisplayEl = document.getElementById("displayTotalDeposits");
                        if (totalDisplayEl) {
                            let currentTotal = parseFloat(totalDisplayEl.textContent.replace(/[^0-9.-]+/g, "")) || 0;
                            let newTotal = currentTotal - val; 
                            totalDisplayEl.textContent = `$${newTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                        }
                    }

                    // Animate and remove row from table
                    row.style.transition = "all 0.3s ease";
                    row.style.opacity = "0";
                    setTimeout(() => row.remove(), 300);
                }
            }
        });
    });

})();
