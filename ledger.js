/**
 * HUOKAING THARA - Asset & Ledger Engine (Persistent with Row Removal)
 */
(() => {
    "use strict";

    // Load initial data from storage or set defaults
    const savedData = JSON.parse(localStorage.getItem('ht_ledger_data')) || [
        { id: "DEP-LN-9901", tier: "Corporate Wholesale", route: "Bakong Network Sweep", volume: 37,775,000.00, status: "Success" },
        { id: "DEP-LN-9905", tier: "Corporate Wholesale", route: "Real-time Gross Settlement", volume: 37,775,000.00, status: "Success" }
    ];

    const LedgerEngine = {
        data: savedData,

        renderLedger: () => {
            const tbody = document.getElementById("depositLogBody");
            if (!tbody) return;
            
            tbody.innerHTML = LedgerEngine.data.map(log => `
                <tr data-id="${log.id}">
                    <td>${log.id}</td>
                    <td>${log.tier}</td>
                    <td>${log.route}</td>
                    <td class="item-amount">$${log.volume.toLocaleString()}</td>
                    <td>
                        <span class="status-badge" style="background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">${log.status}</span>
                    </td>
                    <td>
                        <button class="btn-remove-ledger" data-id="${log.id}" style="background: #f6465d; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">Remove</button>
                    </td>
                </tr>
            `).join("");
            
            localStorage.setItem('ht_ledger_data', JSON.stringify(LedgerEngine.data));
            LedgerEngine.updateTotal();
        },
    
        updateTotal: () => {
            const total = LedgerEngine.data.reduce((sum, item) => sum + item.volume, 0);
            const el = document.getElementById("displayTotalDeposits");
            if (el) el.innerText = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        },

        addEntry: (entry) => {
            LedgerEngine.data.unshift(entry);
            LedgerEngine.renderLedger();
        },

        removeEntry: (id) => {
            LedgerEngine.data = LedgerEngine.data.filter(item => item.id !== id);
            LedgerEngine.renderLedger();
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        LedgerEngine.renderLedger();

        // Global event delegation for ledger remove buttons
        document.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains("btn-remove-ledger")) {
                const entryId = e.target.getAttribute("data-id");
                if (entryId) {
                    const row = e.target.closest("tr");
                    if (row) {
                        row.style.transition = "all 0.3s ease";
                        row.style.opacity = "0";
                        row.style.transform = "translateX(20px)";
                        setTimeout(() => {
                            LedgerEngine.removeEntry(entryId);
                        }, 300);
                    }
                }
            }
        });
    });

    window.LedgerEngine = LedgerEngine;
})();
