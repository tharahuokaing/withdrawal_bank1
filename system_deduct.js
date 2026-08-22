/* =========================================================
   HUOKAING THARA BANKING SYSTEM - TRANSACTION EXECUTION & DEDUCTION
========================================================= */

(() => {
    "use strict";

    /**
     * Executes a transaction row, removes it from the table, and deducts its amount from system total.
     * @param {HTMLElement} buttonElement - The execute button clicked.
     */
    function executeAndDeductRow(buttonElement) {
        // Step 1: Locate the parent row
        const row = buttonElement.closest("tr");
        if (!row) return;

        // Step 2: Locate the amount cell (expects class 'item-amount' or defaults to the 4th cell)
        const amountCell = row.querySelector(".item-amount") || row.cells[3];
        if (!amountCell) return;

        // Extract numeric value from currency string (e.g., "$50,000.00" -> 50000)
        const rawAmountText = amountCell.textContent.replace(/[^0-9.-]+/g, "");
        const transactionAmount = parseFloat(rawAmountText) || 0;

        // Step 3: Deduct amount from system balance display
        const totalDisplayEl = document.getElementById("displayTotalDeposits");
        if (totalDisplayEl) {
            const currentTotalText = totalDisplayEl.textContent.replace(/[^0-9.-]+/g, "");
            const currentTotal = parseFloat(currentTotalText) || 0;

            const updatedTotal = currentTotal - transactionAmount;

            // Format back to currency representation with commas
            totalDisplayEl.textContent = `$${updatedTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            console.log(`[LEDGER UPDATE] Deducted $${transactionAmount.toLocaleString()}. New Total: $${totalDisplayEl.textContent}`);
        }

        // Step 4: Animate row removal
        row.style.transition = "all 0.3s ease";
        row.style.opacity = "0";
        row.style.transform = "translateX(20px)";

        setTimeout(() => {
            row.remove();
            console.log("[SYSTEM] Executed row removed successfully.");
        }, 300);
    }

    // Attach global click event listener for execute-and-remove buttons
    document.addEventListener("DOMContentLoaded", () => {
        document.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains("btn-execute-remove")) {
                executeAndDeductRow(e.target);
            }
        });
    });

})();
