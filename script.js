/* =========================================================
SUPER IPTV PROFESSIONAL MANAGEMENT PANEL
Complete script.js
Matches the supplied index.html
========================================================= */

/* =========================================================
STORAGE KEYS
========================================================= */

const STORAGE = {
customers: "SUPER_IPTV_CUSTOMERS",
payments: "SUPER_IPTV_PAYMENTS",
invoices: "SUPER_IPTV_INVOICES",
notifications: "SUPER_IPTV_NOTIFICATIONS",
plans: "SUPER_IPTV_PLANS",
settings: "SUPER_IPTV_SETTINGS",
theme: "SUPER_IPTV_THEME"
};

/* =========================================================
DEFAULT PLANS
========================================================= */

const DEFAULT_PLANS = [
{
id: "plan_1",
name: "1 Month",
months: 1,
price: 200
},
{
id: "plan_3",
name: "3 Months",
months: 3,
price: 600
},
{
id: "plan_6",
name: "6 Months",
months: 6,
price: 1150
},
{
id: "plan_12",
name: "12 Months",
months: 12,
price: 2000
}
];

/* =========================================================
DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {
companyName: "SUPER IPTV",
defaultPortal: "",
whatsappNumber: "",
upiId: "6289033804@ptsbi",
upiName: "SUPER IPTV",
whatsappTemplate:
`Hello {{NAME}},

Your IPTV subscription is now active.

Username: {{USERNAME}}
Password: {{PASSWORD}}
Plan: {{PLAN}}
Amount: ₹{{AMOUNT}}
Expiry: {{EXPIRY}}
Portal: {{PORTAL_URL}}

Thank you for choosing SUPER IPTV.`
};

/* =========================================================
DATA
========================================================= */

let customers = loadData(STORAGE.customers, []);
let payments = loadData(STORAGE.payments, []);
let invoices = loadData(STORAGE.invoices, []);
let notifications = loadData(STORAGE.notifications, []);
let plans = loadData(STORAGE.plans, DEFAULT_PLANS);
let settings = loadData(STORAGE.settings, DEFAULT_SETTINGS);

let currentCustomerId = null;
let selectedCustomerId = null;

let revenueChart = null;
let customerChart = null;
let reportRevenueChart = null;
let planChart = null;

/* =========================================================
INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

initializeSettings();

initializeTheme();

initializeNavigation();

initializeButtons();

initializeForms();

initializeFilters();

initializeModals();

initializeBackup();

initializePlans();

initializeCharts();

updateAll();

setDefaultStartDate();

});

/* =========================================================
LOCAL STORAGE HELPERS
========================================================= */

function loadData(key, fallback) {

try {

    const data = localStorage.getItem(key);

    if (!data) {
        return structuredCloneSafe(fallback);
    }

    return JSON.parse(data);

} catch (error) {

    console.error("Storage Load Error:", error);

    return structuredCloneSafe(fallback);

}

}

function saveData(key, data) {

localStorage.setItem(
    key,
    JSON.stringify(data)
);

}

function structuredCloneSafe(data) {

return JSON.parse(
    JSON.stringify(data)
);

}

/* =========================================================
SETTINGS
========================================================= */

function initializeSettings() {

document.getElementById("companyName").value =
    settings.companyName || "SUPER IPTV";

document.getElementById("defaultPortal").value =
    settings.defaultPortal || "";

document.getElementById("whatsappNumber").value =
    settings.whatsappNumber || "";

document.getElementById("upiId").value =
    settings.upiId || "6289033804@ptsbi";

document.getElementById("upiName").value =
    settings.upiName || "SUPER IPTV";

document.getElementById("whatsappTemplate").value =
    settings.whatsappTemplate ||
    DEFAULT_SETTINGS.whatsappTemplate;

}

document
.getElementById("saveGeneralSettings")
?.addEventListener("click", () => {

    settings.companyName =
        document.getElementById("companyName").value.trim();

    settings.defaultPortal =
        document.getElementById("defaultPortal").value.trim();

    settings.whatsappNumber =
        document.getElementById("whatsappNumber").value.trim();

    saveData(
        STORAGE.settings,
        settings
    );

    showToast("General settings saved successfully");

});

document
.getElementById("savePaymentSettings")
?.addEventListener("click", () => {

    settings.upiId =
        document.getElementById("upiId").value.trim();

    settings.upiName =
        document.getElementById("upiName").value.trim();

    saveData(
        STORAGE.settings,
        settings
    );

    showToast("Payment settings saved successfully");

    updateQR();

});

document
.getElementById("saveWhatsappTemplate")
?.addEventListener("click", () => {

    settings.whatsappTemplate =
        document
            .getElementById("whatsappTemplate")
            .value;

    saveData(
        STORAGE.settings,
        settings
    );

    showToast("WhatsApp template saved");

});

/* =========================================================
NAVIGATION
========================================================= */

function initializeNavigation() {

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener("click", () => {

            const page =
                button.dataset.page;

            navigateTo(page);

        });

    });


document
    .querySelectorAll("[data-page-link]")
    .forEach(button => {

        button.addEventListener("click", () => {

            navigateTo(
                button.dataset.pageLink
            );

        });

    });


document
    .getElementById("menuToggle")
    ?.addEventListener("click", () => {

        document
            .getElementById("sidebar")
            .classList.toggle("open");

    });

}

function navigateTo(pageId) {

document
    .querySelectorAll(".page")
    .forEach(page => {

        page.classList.remove("active");

    });


const target =
    document.getElementById(pageId);

if (target) {

    target.classList.add("active");

}


document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );

    });


const titles = {

    dashboard: [
        "Dashboard",
        "Welcome back, Administrator"
    ],

    customers: [
        "Customer Management",
        "Manage all your IPTV customers"
    ],

    addCustomer: [
        "Add New Customer",
        "Create a new IPTV subscription"
    ],

    subscriptions: [
        "Subscription Management",
        "Track and renew customer subscriptions"
    ],

    payments: [
        "Payment Management",
        "Track customer payments and revenue"
    ],

    invoices: [
        "Invoices",
        "Create and manage customer invoices"
    ],

    notifications: [
        "Notifications",
        "Important customer and payment alerts"
    ],

    plans: [
        "Plans & Pricing",
        "Manage subscription plans and prices"
    ],

    reports: [
        "Reports & Analytics",
        "Analyze your business performance"
    ],

    backup: [
        "Backup & Data Management",
        "Export and backup your panel data"
    ],

    settings: [
        "Settings",
        "Configure your IPTV management panel"
    ]

};


if (titles[pageId]) {

    document.getElementById("pageTitle").textContent =
        titles[pageId][0];

    document.getElementById("pageSubtitle").textContent =
        titles[pageId][1];

}


document
    .getElementById("sidebar")
    ?.classList.remove("open");

}

/* =========================================================
BUTTONS
========================================================= */

function initializeButtons() {

document
    .getElementById("themeToggle")
    ?.addEventListener("click", toggleTheme);


document
    .getElementById("notificationButton")
    ?.addEventListener("click", () => {

        navigateTo("notifications");

    });


document
    .getElementById("refreshCustomers")
    ?.addEventListener("click", () => {

        renderCustomers();

        showToast("Customer list refreshed");

    });


document
    .getElementById("copyUpi")
    ?.addEventListener("click", copyUPI);


document
    .getElementById("downloadQR")
    ?.addEventListener("click", downloadQR);


document
    .getElementById("clearNotifications")
    ?.addEventListener("click", () => {

        notifications = [];

        saveData(
            STORAGE.notifications,
            notifications
        );

        renderNotifications();

        updateNotificationCount();

        showToast("All notifications marked as read");

    });


document
    .getElementById("printCustomers")
    ?.addEventListener("click", printCustomers);


document
    .getElementById("globalSearch")
    ?.addEventListener("input", e => {

        const value =
            e.target.value.trim().toLowerCase();

        if (value) {

            navigateTo("customers");

            document
                .getElementById("customerSearch")
                .value = value;

        }

        renderCustomers();

    });

}

/* =========================================================
FORM INITIALIZATION
========================================================= */

function initializeForms() {

document
    .getElementById("customerForm")
    ?.addEventListener(
        "submit",
        handleCustomerSubmit
    );


document
    .getElementById("customerForm")
    ?.addEventListener(
        "reset",
        () => {

            setTimeout(() => {

                document
                    .getElementById("amount")
                    .value = "";

                document
                    .getElementById("expiryDate")
                    .value = "";

                resetQR();

                setDefaultStartDate();

            }, 50);

        }
    );


document
    .getElementById("plan")
    ?.addEventListener(
        "change",
        updatePlanDetails
    );


document
    .getElementById("startDate")
    ?.addEventListener(
        "change",
        updateExpiryDate
    );


document
    .getElementById("editPlan")
    ?.addEventListener(
        "change",
        updateEditPlanAmount
    );


document
    .getElementById("editCustomerForm")
    ?.addEventListener(
        "submit",
        handleEditCustomer
    );


document
    .getElementById("renewPlan")
    ?.addEventListener(
        "change",
        updateRenewSummary
    );


document
    .getElementById("confirmRenew")
    ?.addEventListener(
        "click",
        confirmRenew
    );

}

/* =========================================================
PLAN HELPERS
========================================================= */

function getPlan(name) {

return plans.find(
    plan => plan.name === name
);

}

function getPlanPrice(name) {

const plan =
    getPlan(name);

return plan
    ? Number(plan.price)
    : 0;

}

function getPlanMonths(name) {

const plan =
    getPlan(name);

return plan
    ? Number(plan.months)
    : 0;

}

function updatePlanDetails() {

const planName =
    document.getElementById("plan").value;

const amount =
    getPlanPrice(planName);

document.getElementById("amount").value =
    amount || "";

document.getElementById("qrPlan").textContent =
    planName || "-";

document.getElementById("qrAmount").textContent =
    amount
        ? formatCurrency(amount)
        : "₹0";

updateExpiryDate();

updateQR();

}

function setDefaultStartDate() {

const input =
    document.getElementById("startDate");

if (!input) return;

if (!input.value) {

    const today =
        new Date();

    input.value =
        formatDateInput(today);

}

}

function updateExpiryDate() {

const start =
    document.getElementById("startDate").value;

const plan =
    document.getElementById("plan").value;

if (!start || !plan) {

    document
        .getElementById("expiryDate")
        .value = "";

    return;

}

const expiry =
    addMonths(
        parseDate(start),
        getPlanMonths(plan)
    );

document
    .getElementById("expiryDate")
    .value =
    formatDateInput(expiry);

}

/* =========================================================
ADD CUSTOMER
========================================================= */

function handleCustomerSubmit(event) {

event.preventDefault();

showLoading(true);


setTimeout(() => {

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const portalUrl =
        document.getElementById("portalUrl").value.trim();

    const plan =
        document.getElementById("plan").value;

    const amount =
        Number(
            document.getElementById("amount").value
        );

    const startDate =
        document.getElementById("startDate").value;

    const expiryDate =
        document.getElementById("expiryDate").value;

    const status =
        document.getElementById("status").value;


    if (!name ||
        !phone ||
        !username ||
        !password ||
        !plan ||
        !startDate) {

        showLoading(false);

        showToast(
            "Please fill all required fields"
        );

        return;

    }


    const duplicate =
        customers.find(
            customer =>
                customer.username.toLowerCase() ===
                username.toLowerCase()
        );


    if (duplicate) {

        showLoading(false);

        showToast(
            "Username already exists"
        );

        return;

    }


    const id =
        generateId("CUS");


    const customer = {

        id,

        name,

        phone,

        username,

        password,

        portalUrl:
            portalUrl ||
            settings.defaultPortal ||
            "",

        plan,

        amount,

        startDate,

        expiryDate,

        status,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    customers.unshift(customer);


    const payment = {

        id:
            generateId("PAY"),

        customerId:
            id,

        customerName:
            name,

        plan,

        amount,

        date:
            new Date().toISOString(),

        method:
            "UPI",

        status:
            "Pending"

    };


    payments.unshift(payment);


    const invoice = {

        id:
            generateId("INV"),

        customerId:
            id,

        customerName:
            name,

        plan,

        amount,

        date:
            new Date().toISOString(),

        status:
            "Pending"

    };


    invoices.unshift(invoice);


    notifications.unshift({

        id:
            generateId("NOT"),

        type:
            "customer",

        title:
            "New Customer Added",

        message:
            `${name} has been added successfully.`,

        date:
            new Date().toISOString(),

        read:
            false

    });


    saveAllData();


    document
        .getElementById("customerForm")
        .reset();


    resetQR();

    setDefaultStartDate();

    updateAll();

    showLoading(false);

    showToast(
        "Customer added successfully"
    );


    navigateTo("customers");


}, 300);

}

/* =========================================================
CUSTOMER TABLE
========================================================= */

function renderCustomers() {

const table =
    document.getElementById("customersTable");

if (!table) return;


const search =
    (
        document
            .getElementById("customerSearch")
            ?.value || ""
    )
    .toLowerCase()
    .trim();


const statusFilter =
    document
        .getElementById("customerStatusFilter")
        ?.value || "all";


const planFilter =
    document
        .getElementById("customerPlanFilter")
        ?.value || "all";


updateCustomerStatuses();


const filtered =
    customers.filter(customer => {

        const matchesSearch =
            !search ||

            customer.name
                .toLowerCase()
                .includes(search) ||

            customer.phone
                .toLowerCase()
                .includes(search) ||

            customer.username
                .toLowerCase()
                .includes(search);


        const matchesStatus =
            statusFilter === "all" ||
            customer.status === statusFilter;


        const matchesPlan =
            planFilter === "all" ||
            customer.plan === planFilter;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesPlan
        );

    });


if (!filtered.length) {

    table.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="empty-state"
            >

                No customers found

            </td>

        </tr>

    `;

    return;

}


table.innerHTML =
    filtered
        .map(customer => `

            <tr>

                <td>

                    <strong>
                        ${escapeHTML(customer.name)}
                    </strong>

                </td>


                <td>

                    ${escapeHTML(customer.phone)}

                </td>


                <td>

                    <div>
                        <strong>
                            ${escapeHTML(customer.username)}
                        </strong>

                        <small>
                            ${escapeHTML(customer.password)}
                        </small>
                    </div>

                </td>


                <td>

                    ${escapeHTML(customer.plan)}

                </td>


                <td>

                    ${formatCurrency(customer.amount)}

                </td>


                <td>

                    ${formatDisplayDate(customer.expiryDate)}

                </td>


                <td>

                    ${statusBadge(customer.status)}

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="icon-action"
                            title="View"
                            onclick="viewCustomer('${customer.id}')"
                        >
                            👁️
                        </button>

                        <button
                            class="icon-action"
                            title="Edit"
                            onclick="editCustomer('${customer.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            class="icon-action"
                            title="Renew"
                            onclick="openRenewModal('${customer.id}')"
                        >
                            🔄
                        </button>

                        <button
                            class="icon-action danger"
                            title="Delete"
                            onclick="deleteCustomer('${customer.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            </tr>

        `)
        .join("");

}

/* =========================================================
UPDATE STATUS AUTOMATICALLY
========================================================= */

function updateCustomerStatuses() {

const today =
    startOfDay(
        new Date()
    );

let changed = false;


customers.forEach(customer => {

    if (
        customer.status !== "Suspended" &&
        customer.expiryDate
    ) {

        const expiry =
            startOfDay(
                parseDate(
                    customer.expiryDate
                )
            );


        if (
            expiry < today &&
            customer.status !== "Expired"
        ) {

            customer.status =
                "Expired";

            changed = true;

        }

    }

});


if (changed) {

    saveData(
        STORAGE.customers,
        customers
    );

}

}

/* =========================================================
VIEW CUSTOMER
========================================================= */

function viewCustomer(id) {

const customer =
    customers.find(
        item => item.id === id
    );

if (!customer) return;


currentCustomerId =
    id;


const details =
    document.getElementById(
        "customerDetails"
    );


details.innerHTML = `

    <div class="detail-grid">

        <div>
            <span>Name</span>
            <strong>
                ${escapeHTML(customer.name)}
            </strong>
        </div>

        <div>
            <span>Phone</span>
            <strong>
                ${escapeHTML(customer.phone)}
            </strong>
        </div>

        <div>
            <span>Username</span>
            <strong>
                ${escapeHTML(customer.username)}
            </strong>
        </div>

        <div>
            <span>Password</span>
            <strong>
                ${escapeHTML(customer.password)}
            </strong>
        </div>

        <div>
            <span>Plan</span>
            <strong>
                ${escapeHTML(customer.plan)}
            </strong>
        </div>

        <div>
            <span>Amount</span>
            <strong>
                ${formatCurrency(customer.amount)}
            </strong>
        </div>

        <div>
            <span>Start Date</span>
            <strong>
                ${formatDisplayDate(customer.startDate)}
            </strong>
        </div>

        <div>
            <span>Expiry Date</span>
            <strong>
                ${formatDisplayDate(customer.expiryDate)}
            </strong>
        </div>

        <div>
            <span>Status</span>
            <strong>
                ${statusBadge(customer.status)}
            </strong>
        </div>

        <div>
            <span>Portal</span>
            <strong>
                ${escapeHTML(customer.portalUrl || "-")}
            </strong>
        </div>

    </div>

`;


openModal(
    "customerModal"
);

}

/* =========================================================
EDIT CUSTOMER
========================================================= */

function editCustomer(id) {

const customer =
    customers.find(
        item => item.id === id
    );

if (!customer) return;


document.getElementById("editId").value =
    customer.id;

document.getElementById("editName").value =
    customer.name;

document.getElementById("editPhone").value =
    customer.phone;

document.getElementById("editUsername").value =
    customer.username;

document.getElementById("editPassword").value =
    customer.password;

document.getElementById("editPortalUrl").value =
    customer.portalUrl || "";

document.getElementById("editPlan").value =
    customer.plan;

document.getElementById("editAmount").value =
    customer.amount;

document.getElementById("editStartDate").value =
    customer.startDate;

document.getElementById("editExpiryDate").value =
    customer.expiryDate;

document.getElementById("editStatus").value =
    customer.status;


openModal(
    "editCustomerModal"
);

}

function updateEditPlanAmount() {

const plan =
    document.getElementById("editPlan").value;

document.getElementById("editAmount").value =
    getPlanPrice(plan);

}

function handleEditCustomer(event) {

event.preventDefault();


const id =
    document.getElementById("editId").value;


const customer =
    customers.find(
        item => item.id === id
    );


if (!customer) return;


customer.name =
    document.getElementById("editName").value.trim();

customer.phone =
    document.getElementById("editPhone").value.trim();

customer.username =
    document.getElementById("editUsername").value.trim();

customer.password =
    document.getElementById("editPassword").value.trim();

customer.portalUrl =
    document.getElementById("editPortalUrl").value.trim();

customer.plan =
    document.getElementById("editPlan").value;

customer.amount =
    Number(
        document.getElementById("editAmount").value
    );

customer.startDate =
    document.getElementById("editStartDate").value;

customer.expiryDate =
    document.getElementById("editExpiryDate").value;

customer.status =
    document.getElementById("editStatus").value;

customer.updatedAt =
    new Date().toISOString();


saveAllData();

closeAllModals();

updateAll();

showToast(
    "Customer updated successfully"
);

}

/* =========================================================
DELETE CUSTOMER
========================================================= */

function deleteCustomer(id) {

const customer =
    customers.find(
        item => item.id === id
    );

if (!customer) return;


if (
    !confirm(
        `Delete customer "${customer.name}"?`
    )
) return;


customers =
    customers.filter(
        item => item.id !== id
    );


payments =
    payments.filter(
        item => item.customerId !== id
    );


invoices =
    invoices.filter(
        item => item.customerId !== id
    );


saveAllData();

updateAll();

showToast(
    "Customer deleted successfully"
);

}

/* =========================================================
SUBSCRIPTIONS
========================================================= */

function renderSubscriptions() {

const table =
    document.getElementById(
        "subscriptionsTable"
    );

if (!table) return;


updateCustomerStatuses();


table.innerHTML =
    customers.length

        ?

        customers
            .map(customer => `

                <tr>

                    <td>
                        ${escapeHTML(customer.name)}
                    </td>

                    <td>
                        ${escapeHTML(customer.plan)}
                    </td>

                    <td>
                        ${formatDisplayDate(customer.startDate)}
                    </td>

                    <td>
                        ${formatDisplayDate(customer.expiryDate)}
                    </td>

                    <td>
                        ${statusBadge(customer.status)}
                    </td>

                    <td>

                        <button
                            class="secondary-button"
                            onclick="openRenewModal('${customer.id}')"
                        >
                            🔄 Renew
                        </button>

                    </td>

                </tr>

            `)
            .join("")

        :

        emptyRow(
            6,
            "No subscriptions found"
        );

}

/* =========================================================
RENEW MODAL
========================================================= */

function openRenewModal(id) {

selectedCustomerId =
    id;


const customer =
    customers.find(
        item => item.id === id
    );

if (!customer) return;


document.getElementById("renewPlan").value =
    customer.plan;


updateRenewSummary();


openModal(
    "renewModal"
);

}

function updateRenewSummary() {

if (!selectedCustomerId) return;


const customer =
    customers.find(
        item =>
            item.id === selectedCustomerId
    );


if (!customer) return;


const plan =
    document.getElementById("renewPlan").value;


const baseDate =
    customer.expiryDate &&
    parseDate(customer.expiryDate) > new Date()

        ?

        parseDate(customer.expiryDate)

        :

        new Date();


const newExpiry =
    addMonths(
        baseDate,
        getPlanMonths(plan)
    );


document.getElementById("renewExpiry").textContent =
    formatDisplayDate(
        formatDateInput(newExpiry)
    );


document.getElementById("renewAmount").textContent =
    formatCurrency(
        getPlanPrice(plan)
    );

}

function confirmRenew() {

if (!selectedCustomerId) return;


const customer =
    customers.find(
        item =>
            item.id === selectedCustomerId
    );


if (!customer) return;


const plan =
    document.getElementById("renewPlan").value;


const baseDate =
    customer.expiryDate &&
    parseDate(customer.expiryDate) > new Date()

        ?

        parseDate(customer.expiryDate)

        :

        new Date();


const newExpiry =
    addMonths(
        baseDate,
        getPlanMonths(plan)
    );


customer.plan =
    plan;

customer.amount =
    getPlanPrice(plan);

customer.startDate =
    formatDateInput(
        new Date()
    );

customer.expiryDate =
    formatDateInput(
        newExpiry
    );

customer.status =
    "Active";


payments.unshift({

    id:
        generateId("PAY"),

    customerId:
        customer.id,

    customerName:
        customer.name,

    plan,

    amount:
        getPlanPrice(plan),

    date:
        new Date().toISOString(),

    method:
        "UPI",

    status:
        "Pending"

});


invoices.unshift({

    id:
        generateId("INV"),

    customerId:
        customer.id,

    customerName:
        customer.name,

    plan,

    amount:
        getPlanPrice(plan),

    date:
        new Date().toISOString(),

    status:
        "Pending"

});


notifications.unshift({

    id:
        generateId("NOT"),

    type:
        "renewal",

    title:
        "Subscription Renewed",

    message:
        `${customer.name}'s subscription has been renewed.`,

    date:
        new Date().toISOString(),

    read:
        false

});


saveAllData();

closeAllModals();

updateAll();

showToast(
    "Subscription renewed successfully"
);

}

/* =========================================================
PAYMENTS
========================================================= */

function renderPayments() {

const table =
    document.getElementById(
        "paymentsTable"
    );

if (!table) return;


const search =
    (
        document
            .getElementById("paymentSearch")
            ?.value || ""
    )
    .toLowerCase()
    .trim();


const status =
    document
        .getElementById("paymentStatusFilter")
        ?.value || "all";


const filtered =
    payments.filter(payment => {

        const matchesSearch =
            !search ||

            payment.id
                .toLowerCase()
                .includes(search) ||

            payment.customerName
                .toLowerCase()
                .includes(search) ||

            payment.plan
                .toLowerCase()
                .includes(search);


        const matchesStatus =
            status === "all" ||
            payment.status === status;


        return (
            matchesSearch &&
            matchesStatus
        );

    });


table.innerHTML =
    filtered.length

        ?

        filtered
            .map(payment => `

                <tr>

                    <td>
                        ${escapeHTML(payment.id)}
                    </td>

                    <td>
                        ${escapeHTML(payment.customerName)}
                    </td>

                    <td>
                        ${escapeHTML(payment.plan)}
                    </td>

                    <td>
                        ${formatCurrency(payment.amount)}
                    </td>

                    <td>
                        ${formatDisplayDateTime(payment.date)}
                    </td>

                    <td>
                        ${escapeHTML(payment.method)}
                    </td>

                    <td>

                        <select
                            onchange="updatePaymentStatus('${payment.id}', this.value)"
                        >

                            <option
                                value="Paid"
                                ${payment.status === "Paid" ? "selected" : ""}
                            >
                                Paid
                            </option>

                            <option
                                value="Pending"
                                ${payment.status === "Pending" ? "selected" : ""}
                            >
                                Pending
                            </option>

                        </select>

                    </td>

                </tr>

            `)
            .join("")

        :

        emptyRow(
            7,
            "No payments found"
        );

}

function updatePaymentStatus(
paymentId,
status
) {

const payment =
    payments.find(
        item =>
            item.id === paymentId
    );


if (!payment) return;


payment.status =
    status;


const invoice =
    invoices.find(
        item =>
            item.customerId ===
            payment.customerId &&
            item.plan ===
            payment.plan &&
            item.amount ===
            payment.amount
    );


if (invoice) {

    invoice.status =
        status;

}


saveAllData();

updateAll();

showToast(
    `Payment marked as ${status}`
);

}

/* =========================================================
INVOICES
========================================================= */

function renderInvoices() {

const table =
    document.getElementById(
        "invoicesTable"
    );

if (!table) return;


table.innerHTML =
    invoices.length

        ?

        invoices
            .map(invoice => `

                <tr>

                    <td>
                        ${escapeHTML(invoice.id)}
                    </td>

                    <td>
                        ${escapeHTML(invoice.customerName)}
                    </td>

                    <td>
                        ${escapeHTML(invoice.plan)}
                    </td>

                    <td>
                        ${formatCurrency(invoice.amount)}
                    </td>

                    <td>
                        ${formatDisplayDateTime(invoice.date)}
                    </td>

                    <td>
                        ${statusBadge(invoice.status)}
                    </td>

                    <td>

                        <button
                            class="secondary-button"
                            onclick="printInvoice('${invoice.id}')"
                        >
                            🖨️ Print
                        </button>

                    </td>

                </tr>

            `)
            .join("")

        :

        emptyRow(
            7,
            "No invoices found"
        );

}

function printInvoice(id) {

const invoice =
    invoices.find(
        item => item.id === id
    );

if (!invoice) return;


const customer =
    customers.find(
        item =>
            item.id === invoice.customerId
    );


const popup =
    window.open(
        "",
        "_blank"
    );


popup.document.write(`

    <html>

    <head>

        <title>
            ${invoice.id}
        </title>

        <style>

            body {
                font-family: Arial;
                padding: 40px;
            }

            h1 {
                margin-bottom: 5px;
            }

            .invoice {
                max-width: 700px;
                margin: auto;
            }

            .row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #ddd;
            }

        </style>

    </head>

    <body>

        <div class="invoice">

            <h1>
                ${escapeHTML(settings.companyName)}
            </h1>

            <h2>
                Invoice
            </h2>

            <div class="row">
                <span>Invoice ID</span>
                <strong>${invoice.id}</strong>
            </div>

            <div class="row">
                <span>Customer</span>
                <strong>${escapeHTML(invoice.customerName)}</strong>
            </div>

            <div class="row">
                <span>Username</span>
                <strong>${escapeHTML(customer?.username || "-")}</strong>
            </div>

            <div class="row">
                <span>Plan</span>
                <strong>${escapeHTML(invoice.plan)}</strong>
            </div>

            <div class="row">
                <span>Amount</span>
                <strong>${formatCurrency(invoice.amount)}</strong>
            </div>

            <div class="row">
                <span>Status</span>
                <strong>${invoice.status}</strong>
            </div>

            <br>

            <button onclick="window.print()">
                Print Invoice
            </button>

        </div>

    </body>

    </html>

`);


popup.document.close();

}

/* =========================================================
NOTIFICATIONS
========================================================= */

function renderNotifications() {

const list =
    document.getElementById(
        "notificationList"
    );

if (!list) return;


if (!notifications.length) {

    list.innerHTML = `

        <div class="empty-state">

            No notifications

        </div>

    `;

    return;

}


list.innerHTML =
    notifications
        .map(notification => `

            <div
                class="notification-item
                ${notification.read ? "read" : "unread"}"
            >

                <div>

                    <strong>
                        ${escapeHTML(notification.title)}
                    </strong>

                    <p>
                        ${escapeHTML(notification.message)}
                    </p>

                    <small>
                        ${formatDisplayDateTime(notification.date)}
                    </small>

                </div>

            </div>

        `)
        .join("");

}

function updateNotificationCount() {

const unread =
    notifications.filter(
        item => !item.read
    ).length;


const count =
    document.getElementById(
        "notificationCount"
    );


const dot =
    document.getElementById(
        "notificationDot"
    );


if (count) {

    count.textContent =
        unread;

}


if (dot) {

    dot.style.display =
        unread > 0
            ? "block"
            : "none";

}

}

/* =========================================================
PLANS
========================================================= */

function initializePlans() {

document
    .getElementById("addPlanButton")
    ?.addEventListener(
        "click",
        addPlan
    );

}

function renderPlans() {

const grid =
    document.getElementById(
        "plansGrid"
    );

if (!grid) return;


grid.innerHTML =
    plans
        .map(plan => `

            <div class="panel-card plan-card">

                <div class="plan-icon">
                    📦
                </div>

                <h3>
                    ${escapeHTML(plan.name)}
                </h3>

                <div class="plan-price">
                    ${formatCurrency(plan.price)}
                </div>

                <p>
                    ${plan.months} month${plan.months > 1 ? "s" : ""}
                </p>

                <button
                    class="secondary-button"
                    onclick="editPlan('${plan.id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    class="secondary-button"
                    onclick="deletePlan('${plan.id}')"
                >
                    🗑️ Delete
                </button>

            </div>

        `)
        .join("");

}

function addPlan() {

const name =
    prompt(
        "Enter plan name:"
    );


if (!name) return;


const months =
    Number(
        prompt(
            "Enter duration in months:"
        )
    );


const price =
    Number(
        prompt(
            "Enter price:"
        )
    );


if (
    !months ||
    !price
) {

    showToast(
        "Invalid plan details"
    );

    return;

}


plans.push({

    id:
        generateId("PLAN"),

    name:
        name.trim(),

    months,

    price

});


saveData(
    STORAGE.plans,
    plans
);


renderPlans();

refreshPlanSelects();

showToast(
    "Plan added successfully"
);

}

function editPlan(id) {

const plan =
    plans.find(
        item =>
            item.id === id
    );


if (!plan) return;


const newPrice =
    Number(
        prompt(
            "Enter new price:",
            plan.price
        )
    );


if (!newPrice) return;


plan.price =
    newPrice;


saveData(
    STORAGE.plans,
    plans
);


renderPlans();

refreshPlanSelects();

updateAll();

showToast(
    "Plan updated successfully"
);

}

function deletePlan(id) {

const plan =
    plans.find(
        item =>
            item.id === id
    );


if (!plan) return;


if (
    !confirm(
        `Delete plan "${plan.name}"?`
    )
) return;


plans =
    plans.filter(
        item =>
            item.id !== id
    );


saveData(
    STORAGE.plans,
    plans
);


renderPlans();

refreshPlanSelects();

showToast(
    "Plan deleted successfully"
);

}

function refreshPlanSelects() {

const selects = [

    document.getElementById("plan"),

    document.getElementById("editPlan"),

    document.getElementById("renewPlan")

];


selects.forEach(select => {

    if (!select) return;


    const current =
        select.value;


    select.innerHTML =
        plans
            .map(plan => `

                <option
                    value="${escapeHTML(plan.name)}"
                >
                    ${escapeHTML(plan.name)}
                    -
                    ${formatCurrency(plan.price)}
                </option>

            `)
            .join("");


    if (
        plans.some(
            plan =>
                plan.name === current
        )
    ) {

        select.value =
            current;

    }

});

}

/* =========================================================
REPORTS
========================================================= */

function renderReports() {

const totalRevenue =
    getTotalRevenue();


document.getElementById(
    "reportCustomers"
).textContent =
    customers.length;


document.getElementById(
    "reportRevenue"
).textContent =
    formatCurrency(
        totalRevenue
    );


const average =
    payments.length
        ? totalRevenue / payments.length
        : 0;


document.getElementById(
    "reportAverage"
).textContent =
    formatCurrency(
        average
    );


createCharts();

}

/* =========================================================
DASHBOARD
========================================================= */

function updateDashboard() {

updateCustomerStatuses();


const active =
    customers.filter(
        customer =>
            customer.status === "Active"
    ).length;


const expired =
    customers.filter(
        customer =>
            customer.status === "Expired"
    ).length;


const expiring =
    getExpiringCustomers(7)
        .length;


const totalRevenue =
    getTotalRevenue();


const monthlyRevenue =
    getMonthlyRevenue();


const pending =
    payments.filter(
        payment =>
            payment.status === "Pending"
    ).length;


const newCustomers =
    customers.filter(
        customer =>
            isCurrentMonth(
                customer.createdAt
            )
    ).length;


setText(
    "totalCustomers",
    customers.length
);

setText(
    "activeCustomers",
    active
);

setText(
    "expiredCustomers",
    expired
);

setText(
    "expiringSoon",
    expiring
);

setText(
    "totalRevenue",
    formatCurrency(
        totalRevenue
    )
);

setText(
    "monthlyRevenue",
    formatCurrency(
        monthlyRevenue
    )
);

setText(
    "pendingPayments",
    pending
);

setText(
    "newCustomers",
    newCustomers
);


setText(
    "subscriptionActive",
    active
);

setText(
    "subscriptionExpiring",
    expiring
);

setText(
    "subscriptionExpired",
    expired
);


setText(
    "paymentTotalRevenue",
    formatCurrency(
        totalRevenue
    )
);

setText(
    "paymentMonthlyRevenue",
    formatCurrency(
        monthlyRevenue
    )
);

setText(
    "paymentPending",
    pending
);


setText(
    "expiringBadge",
    expiring
);


renderRecentCustomers();

renderExpiringCustomers();

}

function renderRecentCustomers() {

const table =
    document.getElementById(
        "recentCustomersTable"
    );


if (!table) return;


const recent =
    customers
        .slice(0, 5);


table.innerHTML =
    recent.length

        ?

        recent
            .map(customer => `

                <tr>

                    <td>
                        ${escapeHTML(customer.name)}
                    </td>

                    <td>
                        ${escapeHTML(customer.username)}
                    </td>

                    <td>
                        ${escapeHTML(customer.plan)}
                    </td>

                    <td>
                        ${formatDisplayDate(customer.expiryDate)}
                    </td>

                    <td>
                        ${statusBadge(customer.status)}
                    </td>

                </tr>

            `)
            .join("")

        :

        emptyRow(
            5,
            "No customers yet"
        );

}

function renderExpiringCustomers() {

const list =
    document.getElementById(
        "expiringCustomersList"
    );


if (!list) return;


const expiring =
    getExpiringCustomers(7);


list.innerHTML =
    expiring.length

        ?

        expiring
            .map(customer => `

                <div class="expiring-item">

                    <strong>
                        ${escapeHTML(customer.name)}
                    </strong>

                    <span>
                        Expires:
                        ${formatDisplayDate(customer.expiryDate)}
                    </span>

                </div>

            `)
            .join("")

        :

        `<div class="empty-state">
            No customers expiring soon
        </div>`;

}

/* =========================================================
CHARTS
========================================================= */

function initializeCharts() {

document
    .getElementById("revenuePeriod")
    ?.addEventListener(
        "change",
        createCharts
    );

}

function createCharts() {

if (
    typeof Chart ===
    "undefined"
) return;


createRevenueChart();

createCustomerChart();

createReportRevenueChart();

createPlanChart();

}

function createRevenueChart() {

const canvas =
    document.getElementById(
        "revenueChart"
    );


if (!canvas) return;


if (revenueChart) {

    revenueChart.destroy();

}


const months =
    Number(
        document
            .getElementById("revenuePeriod")
            ?.value || 6
    );


const labels = [];

const data = [];


for (
    let i = months - 1;
    i >= 0;
    i--
) {

    const date =
        new Date();


    date.setMonth(
        date.getMonth() - i
    );


    labels.push(
        date.toLocaleDateString(
            "en-IN",
            {
                month: "short",
                year: "numeric"
            }
        )
    );


    data.push(
        getRevenueForMonth(
            date.getFullYear(),
            date.getMonth()
        )
    );

}


revenueChart =
    new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label:
                            "Revenue",

                        data,

                        tension:
                            0.35,

                        fill:
                            true

                    }

                ]

            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                plugins: {

                    legend: {

                        display:
                            false

                    }

                }

            }

        }
    );

}

function createCustomerChart() {

const canvas =
    document.getElementById(
        "customerChart"
    );


if (!canvas) return;


if (customerChart) {

    customerChart.destroy();

}


const active =
    customers.filter(
        c => c.status === "Active"
    ).length;


const expired =
    customers.filter(
        c => c.status === "Expired"
    ).length;


const suspended =
    customers.filter(
        c => c.status === "Suspended"
    ).length;


customerChart =
    new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels: [

                    "Active",

                    "Expired",

                    "Suspended"

                ],

                datasets: [

                    {

                        data: [

                            active,

                            expired,

                            suspended

                        ]

                    }

                ]

            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false

            }

        }
    );

}

function createReportRevenueChart() {

const canvas =
    document.getElementById(
        "reportRevenueChart"
    );


if (!canvas) return;


if (reportRevenueChart) {

    reportRevenueChart.destroy();

}


const labels = [];

const data = [];


for (
    let i = 11;
    i >= 0;
    i--
) {

    const date =
        new Date();


    date.setMonth(
        date.getMonth() - i
    );


    labels.push(
        date.toLocaleDateString(
            "en-IN",
            {
                month: "short"
            }
        )
    );


    data.push(
        getRevenueForMonth(
            date.getFullYear(),
            date.getMonth()
        )
    );

}


reportRevenueChart =
    new Chart(
        canvas,
        {

            type: "bar",

            data: {

                labels,

                datasets: [

                    {

                        label:
                            "Revenue",

                        data

                    }

                ]

            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false

            }

        }
    );

}

function createPlanChart() {

const canvas =
    document.getElementById(
        "planChart"
    );


if (!canvas) return;


if (planChart) {

    planChart.destroy();

}


const labels =
    plans.map(
        plan => plan.name
    );


const data =
    plans.map(
        plan =>

            customers.filter(
                customer =>
                    customer.plan ===
                    plan.name
            ).length

    );


planChart =
    new Chart(
        canvas,
        {

            type: "bar",

            data: {

                labels,

                datasets: [

                    {

                        label:
                            "Customers",

                        data

                    }

                ]

            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false

            }

        }

    );

}

/* =========================================================
QR CODE
========================================================= */

function updateQR() {

const container =
    document.getElementById(
        "qrcode"
    );


if (!container) return;


const plan =
    document.getElementById(
        "plan"
    ).value;


const amount =
    Number(
        document.getElementById(
            "amount"
        ).value
    );


if (
    !plan ||
    !amount
) {

    resetQR();

    return;

}


container.innerHTML =
    "";


const upiId =
    settings.upiId ||
    "6289033804@ptsbi";


const upiName =
    settings.upiName ||
    "SUPER IPTV";


const upiUrl =

    "upi://pay" +

    "?pa=" +
    encodeURIComponent(
        upiId
    ) +

    "&pn=" +
    encodeURIComponent(
        upiName
    ) +

    "&am=" +
    encodeURIComponent(
        amount
    ) +

    "&cu=INR" +

    "&tn=" +
    encodeURIComponent(
        `${plan} Subscription`
    );


if (
    typeof QRCode ===
    "undefined"
) {

    container.innerHTML = `

        <p>
            QR library not loaded.
        </p>

    `;

    return;

}


new QRCode(

    container,

    {

        text:
            upiUrl,

        width:
            220,

        height:
            220,

        correctLevel:
            QRCode.CorrectLevel.H

    }

);

}

function resetQR() {

const container =
    document.getElementById(
        "qrcode"
    );


if (!container) return;


container.innerHTML = `

    <div class="qr-placeholder">

        <span>
            ▣
        </span>

        <p>
            Select a plan
        </p>

        <small>
            QR code will appear here
        </small>

    </div>

`;


setText(
    "qrPlan",
    "-"
);


setText(
    "qrAmount",
    "₹0"
);

}

function copyUPI() {

const upi =
    settings.upiId ||
    "6289033804@ptsbi";


navigator.clipboard
    .writeText(upi)
    .then(() => {

        showToast(
            "UPI ID copied"
        );

    })
    .catch(() => {

        showToast(
            "Unable to copy UPI ID"
        );

    });

}

function downloadQR() {

const canvas =
    document.querySelector(
        "#qrcode canvas"
    );


const image =
    document.querySelector(
        "#qrcode img"
    );


let url = "";


if (canvas) {

    url =
        canvas.toDataURL(
            "image/png"
        );

}

else if (image) {

    url =
        image.src;

}


if (!url) {

    showToast(
        "Please select a plan first"
    );

    return;

}


const link =
    document.createElement(
        "a"
    );


link.href =
    url;


link.download =
    "SUPER-IPTV-Payment-QR.png";


link.click();

}

/* =========================================================
WHATSAPP
========================================================= */

document
.getElementById("modalWhatsApp")
?.addEventListener(
"click",
() => {

        if (
            currentCustomerId
        ) {

            sendWhatsApp(
                currentCustomerId
            );

        }

    }
);

function sendWhatsApp(id) {

const customer =
    customers.find(
        item =>
            item.id === id
    );


if (!customer) return;


let message =
    settings.whatsappTemplate ||
    DEFAULT_SETTINGS.whatsappTemplate;


const replacements = {

    "{{NAME}}":
        customer.name,

    "{{USERNAME}}":
        customer.username,

    "{{PASSWORD}}":
        customer.password,

    "{{PLAN}}":
        customer.plan,

    "{{AMOUNT}}":
        customer.amount,

    "{{EXPIRY}}":
        formatDisplayDate(
            customer.expiryDate
        ),

    "{{PORTAL_URL}}":
        customer.portalUrl || ""

};


Object
    .entries(
        replacements
    )
    .forEach(
        ([key, value]) => {

            message =
                message.replaceAll(
                    key,
                    value ?? ""
                );

        }
    );


let phone =
    customer.phone
        .replace(
            /\D/g,
            ""
        );


if (
    phone.length === 10
) {

    phone =
        "91" +
        phone;

}


const url =
    "https://wa.me/" +
    phone +
    "?text=" +
    encodeURIComponent(
        message
    );


window.open(
    url,
    "_blank"
);

}

/* =========================================================
MODALS
========================================================= */

function initializeModals() {

document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            closeAllModals
        );

    });


document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    closeAllModals();

                }

            }
        );

    });

}

function openModal(id) {

document
    .getElementById(id)
    ?.classList.add(
        "active"
    );

}

function closeAllModals() {

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.classList.remove(
            "active"
        );

    });

}

/* =========================================================
FILTERS
========================================================= */

function initializeFilters() {

document
    .getElementById("customerSearch")
    ?.addEventListener(
        "input",
        renderCustomers
    );


document
    .getElementById("customerStatusFilter")
    ?.addEventListener(
        "change",
        renderCustomers
    );


document
    .getElementById("customerPlanFilter")
    ?.addEventListener(
        "change",
        renderCustomers
    );


document
    .getElementById("paymentSearch")
    ?.addEventListener(
        "input",
        renderPayments
    );


document
    .getElementById("paymentStatusFilter")
    ?.addEventListener(
        "change",
        renderPayments
    );

}

/* =========================================================
BACKUP
========================================================= */

function initializeBackup() {

document
    .getElementById("exportBackup")
    ?.addEventListener(
        "click",
        exportBackup
    );


document
    .getElementById("importBackup")
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "importBackupFile"
                )
                .click();

        }
    );


document
    .getElementById("importBackupFile")
    ?.addEventListener(
        "change",
        importBackup
    );

}

function exportBackup() {

const backup = {

    version:
        "1.0",

    exportedAt:
        new Date().toISOString(),

    customers,

    payments,

    invoices,

    notifications,

    plans,

    settings

};


const blob =
    new Blob(
        [
            JSON.stringify(
                backup,
                null,
                2
            )
        ],
        {
            type:
                "application/json"
        }
    );


const url =
    URL.createObjectURL(
        blob
    );


const link =
    document.createElement(
        "a"
    );


link.href =
    url;


link.download =

    `SUPER-IPTV-Backup-${formatDateInput(
        new Date()
    )}.json`;


link.click();


URL.revokeObjectURL(
    url
);


showToast(
    "Backup exported successfully"
);

}

function importBackup(event) {

const file =
    event.target.files[0];


if (!file) return;


const reader =
    new FileReader();


reader.onload =
    function () {

        try {

            const backup =
                JSON.parse(
                    reader.result
                );


            if (
                !confirm(
                    "Import backup? Existing panel data will be replaced."
                )
            ) return;


            customers =
                backup.customers || [];

            payments =
                backup.payments || [];

            invoices =
                backup.invoices || [];

            notifications =
                backup.notifications || [];

            plans =
                backup.plans ||
                DEFAULT_PLANS;

            settings =
                backup.settings ||
                DEFAULT_SETTINGS;


            saveAllData();

            initializeSettings();

            updateAll();

            showToast(
                "Backup imported successfully"
            );


        }

        catch (error) {

            console.error(
                error
            );

            showToast(
                "Invalid backup file"
            );

        }

    };


reader.readAsText(
    file
);


event.target.value =
    "";

}

/* =========================================================
PRINT CUSTOMERS
========================================================= */

function printCustomers() {

const popup =
    window.open(
        "",
        "_blank"
    );


popup.document.write(`

    <html>

    <head>

        <title>
            Customer List
        </title>

        <style>

            body {
                font-family: Arial;
                padding: 20px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            th,
            td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }

            th {
                background: #f5f5f5;
            }

        </style>

    </head>

    <body>

        <h1>
            ${escapeHTML(settings.companyName)}
        </h1>

        <h2>
            Customer List
        </h2>

        <table>

            <tr>

                <th>Name</th>

                <th>Phone</th>

                <th>Username</th>

                <th>Plan</th>

                <th>Amount</th>

                <th>Expiry</th>

                <th>Status</th>

            </tr>

            ${customers
                .map(customer => `

                    <tr>

                        <td>
                            ${escapeHTML(customer.name)}
                        </td>

                        <td>
                            ${escapeHTML(customer.phone)}
                        </td>

                        <td>
                            ${escapeHTML(customer.username)}
                        </td>

                        <td>
                            ${escapeHTML(customer.plan)}
                        </td>

                        <td>
                            ${formatCurrency(customer.amount)}
                        </td>

                        <td>
                            ${formatDisplayDate(customer.expiryDate)}
                        </td>

                        <td>
                            ${customer.status}
                        </td>

                    </tr>

                `)
                .join("")}

        </table>

        <script>
            window.onload = function() {
                window.print();
            };
        <\/script>

    </body>

    </html>

`);


popup.document.close();

}

/* =========================================================
THEME
========================================================= */

function initializeTheme() {

const theme =
    localStorage.getItem(
        STORAGE.theme
    );


if (
    theme === "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

}

}

function toggleTheme() {

document.body.classList.toggle(
    "dark-mode"
);


const isDark =
    document.body.classList.contains(
        "dark-mode"
    );


localStorage.setItem(
    STORAGE.theme,
    isDark
        ? "dark"
        : "light"
);

}

/* =========================================================
UPDATE ALL
========================================================= */

function updateAll() {

updateCustomerStatuses();

saveAllData();

updateDashboard();

renderCustomers();

renderSubscriptions();

renderPayments();

renderInvoices();

renderNotifications();

renderPlans();

renderReports();

updateNotificationCount();

createCharts();

}

/* =========================================================
SAVE ALL
========================================================= */

function saveAllData() {

saveData(
    STORAGE.customers,
    customers
);

saveData(
    STORAGE.payments,
    payments
);

saveData(
    STORAGE.invoices,
    invoices
);

saveData(
    STORAGE.notifications,
    notifications
);

saveData(
    STORAGE.plans,
    plans
);

saveData(
    STORAGE.settings,
    settings
);

}

/* =========================================================
REVENUE HELPERS
========================================================= */

function getTotalRevenue() {

return payments
    .filter(
        payment =>
            payment.status === "Paid"
    )
    .reduce(
        (
            total,
            payment
        ) =>

            total +
            Number(
                payment.amount || 0
            ),

        0
    );

}

function getMonthlyRevenue() {

return payments
    .filter(
        payment =>

            payment.status === "Paid" &&

            isCurrentMonth(
                payment.date
            )

    )
    .reduce(
        (
            total,
            payment
        ) =>

            total +
            Number(
                payment.amount || 0
            ),

        0
    );

}

function getRevenueForMonth(
year,
month
) {

return payments
    .filter(payment => {

        if (
            payment.status !==
            "Paid"
        ) {

            return false;

        }


        const date =
            new Date(
                payment.date
            );


        return (

            date.getFullYear() ===
            year &&

            date.getMonth() ===
            month

        );

    })
    .reduce(
        (
            total,
            payment
        ) =>

            total +
            Number(
                payment.amount || 0
            ),

        0
    );

}

/* =========================================================
EXPIRING CUSTOMERS
========================================================= */

function getExpiringCustomers(
days
) {

const today =
    startOfDay(
        new Date()
    );


const future =
    new Date(
        today
    );


future.setDate(
    future.getDate() +
    days
);


return customers.filter(
    customer => {

        if (
            customer.status !==
            "Active"
        ) {

            return false;

        }


        const expiry =
            startOfDay(
                parseDate(
                    customer.expiryDate
                )
            );


        return (

            expiry >= today &&

            expiry <= future

        );

    }
);

}

/* =========================================================
DATE FUNCTIONS
========================================================= */

function parseDate(value) {

if (!value) {

    return new Date();

}


const parts =
    value.split("-");


if (
    parts.length === 3
) {

    return new Date(

        Number(parts[0]),

        Number(parts[1]) - 1,

        Number(parts[2])

    );

}


return new Date(
    value
);

}

function addMonths(
date,
months
) {

const result =
    new Date(
        date
    );


result.setMonth(
    result.getMonth() +
    Number(months)
);


return result;

}

function formatDateInput(
date
) {

const year =
    date.getFullYear();


const month =
    String(
        date.getMonth() + 1
    )
    .padStart(
        2,
        "0"
    );


const day =
    String(
        date.getDate()
    )
    .padStart(
        2,
        "0"
    );


return (

    year +
    "-" +
    month +
    "-" +
    day

);

}

function formatDisplayDate(
value
) {

if (!value) return "-";


const date =
    parseDate(
        value
    );


return date.toLocaleDateString(
    "en-IN",
    {

        day:
            "2-digit",

        month:
            "short",

        year:
            "numeric"

    }
);

}

function formatDisplayDateTime(
value
) {

if (!value) return "-";


const date =
    new Date(
        value
    );


return date.toLocaleString(
    "en-IN"
);

}

function startOfDay(
date
) {

const result =
    new Date(
        date
    );


result.setHours(
    0,
    0,
    0,
    0
);


return result;

}

function isCurrentMonth(
value
) {

if (!value) return false;


const date =
    new Date(
        value
    );


const now =
    new Date();


return (

    date.getMonth() ===
    now.getMonth() &&

    date.getFullYear() ===
    now.getFullYear()

);

}

/* =========================================================
UI HELPERS
========================================================= */

function formatCurrency(
amount
) {

return Number(
    amount || 0
).toLocaleString(
    "en-IN",
    {

        style:
            "currency",

        currency:
            "INR",

        maximumFractionDigits:
            0

    }
);

}

function statusBadge(
status
) {

const className =
    String(
        status || ""
    )
    .toLowerCase();


return `

    <span
        class="badge ${className}"
    >
        ${escapeHTML(status || "-")}
    </span>

`;

}

function emptyRow(
colspan,
text
) {

return `

    <tr>

        <td
            colspan="${colspan}"
            class="empty-state"
        >

            ${escapeHTML(text)}

        </td>

    </tr>

`;

}

function setText(
id,
value
) {

const element =
    document.getElementById(
        id
    );


if (element) {

    element.textContent =
        value;

}

}

function generateId(
prefix
) {

return (

    prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
        .toString(36)
        .substring(2, 8)

);

}

function escapeHTML(
value
) {

return String(
    value ?? ""
)
.replace(
    /&/g,
    "&amp;"
)
.replace(
    /</g,
    "&lt;"
)
.replace(
    />/g,
    "&gt;"
)
.replace(
    /"/g,
    "&quot;"
)
.replace(
    /'/g,
    "&#039;"
);

}

/* =========================================================
TOAST
========================================================= */

let toastTimer;

function showToast(
message
) {

const toast =
    document.getElementById(
        "toast"
    );


const text =
    document.getElementById(
        "toastMessage"
    );


if (!toast || !text) return;


text.textContent =
    message;


toast.classList.add(
    "show"
);


clearTimeout(
    toastTimer
);


toastTimer =
    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}

/* =========================================================
LOADING
========================================================= */

function showLoading(
show
) {

const overlay =
    document.getElementById(
        "loadingOverlay"
    );


if (!overlay) return;


overlay.classList.toggle(
    "active",
    show
);

}

/* =========================================================
GLOBAL FUNCTIONS
Required because HTML onclick attributes
call these functions.
========================================================= */

window.viewCustomer =
viewCustomer;

window.editCustomer =
editCustomer;

window.deleteCustomer =
deleteCustomer;

window.openRenewModal =
openRenewModal;

window.updatePaymentStatus =
updatePaymentStatus;

window.printInvoice =
printInvoice;

window.editPlan =
editPlan;

window.deletePlan =
deletePlan;

/* =========================================================
END OF SCRIPT
========================================================= */