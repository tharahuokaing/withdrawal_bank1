/* =========================================================
   HUOKAING THARA - WITHDRAWAL MODULE (WITH REMOVE ACTION)
========================================================= */

const WithdrawalModule = {
    withdrawFunds: function(amountInput) {
        const amount = parseFloat(amountInput);

        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount.");
            return;
        }

        const referenceId = "WDR-" + Math.floor(Math.random() * 10000);

        // Add to Ledger Engine as a negative value
        if (window.LedgerEngine && typeof window.LedgerEngine.addEntry === "function") {
            window.LedgerEngine.addEntry({
                id: referenceId,
                tier: "Account Holder",
                route: "Debit Withdrawal",
                volume: -amount,
                status: "Success"
            });
        } else {
            // Fallback manual DOM injection if LedgerEngine builds rows directly
            this.appendRowToTable(referenceId, -amount);
        }
        
        const inputField = document.getElementById("withdrawInput");
        if (inputField) inputField.value = ""; // Clear input
    },

    /**
     * Helper to dynamically append row with Success badge and a Remove button behind it
     */
    appendRowToTable: function(id, volume) {
        const tbody = document.getElementById("depositLogBody");
        if (!tbody) return;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${id}</td>
            <td>Account Holder</td>
            <td>Debit Withdrawal</td>
            <td class="item-amount">$${volume.toLocaleString()}</td>
            <td>
                <span class="status-badge" style="background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-right: 6px;">Success</span>
                <button class="btn-remove-row" style="background: #f6465d; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">Remove</button>
            </td>
        `;
        tbody.prepend(row);
    }
};

window.WithdrawalModule = WithdrawalModule;

/* =========================================================
   GLOBAL EVENT LISTENER FOR REMOVE BUTTONS
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("btn-remove-row")) {
            const row = e.target.closest("tr");
            if (row) {
                // Optional: Deduct amount back from system balance if desired
                const amountCell = row.querySelector(".item-amount");
                if (amountCell) {
                    const rawVal = amountCell.textContent.replace(/[^0-9.-]+/g, "");
                    const val = parseFloat(rawVal) || 0;
                    
                    const totalDisplayEl = document.getElementById("displayTotalDeposits");
                    if (totalDisplayEl) {
                        let currentTotal = parseFloat(totalDisplayEl.textContent.replace(/[^0-9.-]+/g, "")) || 0;
                        // Since volume is negative, subtracting it adds it back to total capital
                        let newTotal = currentTotal - val; 
                        totalDisplayEl.textContent = `$${newTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                    }
                }

                // Animate and remove row
                row.style.transition = "all 0.3s ease";
                row.style.opacity = "0";
                setTimeout(() => row.remove(), 300);
            }
        }
    });
});
