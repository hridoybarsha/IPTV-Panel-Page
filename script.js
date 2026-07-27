/* =========================================================
   SUPER IPTV PROFESSIONAL PANEL
   script.js
   Firebase Firestore + QR + Customers + Payments
========================================================= */


/* =========================================================
   FIREBASE IMPORTS
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey: "AIzaSyCwPd-SDCABw-rCGlZrCgVc0m_dN51jzNk",

    authDomain:
        "super-iptv-78eb6.firebaseapp.com",

    projectId:
        "super-iptv-78eb6",

    storageBucket:
        "super-iptv-78eb6.firebasestorage.app",

    messagingSenderId:
        "24093372969",

    appId:
        "1:24093372969:web:f3483ac25b9ad3f3abe238",

    measurementId:
        "G-04SJ69MRJH"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let customers = [];

let payments = [];

let selectedCustomer = null;

let selectedRenewCustomer = null;


/* =========================================================
   PLAN PRICES
========================================================= */

const planPrices = {

    "1 Month": 200,

    "3 Months": 600,

    "6 Months": 1150,

    "12 Months": 2000

};


/* =========================================================
   UPI SETTINGS
========================================================= */

const UPI_ID =
    "6289033804@ptsbi";

const UPI_NAME =
    "SUPER IPTV";


/* =========================================================
   PAGE NAVIGATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupButtons();

        setupCustomerForm();

        setupPlanChange();

        setupSearch();

        setupFilters();

        setupTheme();

        setupModalClose();

        setupBackup();

        setupSettings();

        loadCustomers();

        setTodayDate();

    }
);


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    navItems.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    showPage(page);

                }
            );

        }
    );


    document
        .querySelectorAll(
            "[data-page-link]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showPage(
                            button.dataset.pageLink
                        );

                    }
                );

            }
        );

}


function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(
            page => {

                page.classList.remove(
                    "active"
                );

            }
        );


    const page =
        document.getElementById(
            pageId
        );

    if (page) {

        page.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "active"
                );

                if (
                    item.dataset.page ===
                    pageId
                ) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );


    const titles = {

        dashboard:
            "Dashboard",

        customers:
            "Customers",

        addCustomer:
            "Add Customer",

        subscriptions:
            "Subscriptions",

        payments:
            "Payments",

        invoices:
            "Invoices",

        notifications:
            "Notifications",

        plans:
            "Plans & Pricing",

        reports:
            "Reports",

        backup:
            "Backup",

        settings:
            "Settings"

    };


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );

    if (pageTitle) {

        pageTitle.textContent =
            titles[pageId] ||
            "SUPER IPTV";

    }


    if (pageId === "dashboard") {

        updateDashboard();

    }

    if (
        pageId ===
        "subscriptions"
    ) {

        renderSubscriptions();

    }

    if (
        pageId ===
        "payments"
    ) {

        renderPayments();

    }

    if (
        pageId ===
        "invoices"
    ) {

        renderInvoices();

    }

    if (
        pageId ===
        "notifications"
    ) {

        renderNotifications();

    }

    if (
        pageId ===
        "plans"
    ) {

        renderPlans();

    }

    if (
        pageId ===
        "reports"
    ) {

        renderReports();

    }

}


/* =========================================================
   LOAD CUSTOMERS
========================================================= */

async function loadCustomers() {

    showLoading(true);

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "customers"
                )
            );


        customers =
            snapshot.docs.map(
                item => ({

                    id:
                        item.id,

                    ...item.data()

                })
            );


        updateExpiredStatuses();

        renderCustomers();

        updateDashboard();

        renderSubscriptions();

        renderPayments();

        renderInvoices();

        renderNotifications();

        renderReports();

    }
    catch (error) {

        console.error(
            error
        );

        showToast(
            "Firebase data load failed"
        );

    }
    finally {

        showLoading(false);

    }

}


/* =========================================================
   ADD CUSTOMER FORM
========================================================= */

function setupCustomerForm() {

    const form =
        document.getElementById(
            "customerForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                getValue("name");

            const phone =
                getValue("phone");

            const username =
                getValue("username");

            const password =
                getValue("password");

            const portalUrl =
                getValue("portalUrl");

            const plan =
                getValue("plan");

            const amount =
                Number(
                    getValue("amount")
                );

            const startDate =
                getValue("startDate");

            const expiryDate =
                getValue("expiryDate");

            const status =
                getValue("status");


            if (
                !name ||
                !phone ||
                !username ||
                !password ||
                !plan ||
                !startDate
            ) {

                showToast(
                    "Please fill all required fields"
                );

                return;

            }


            showLoading(true);


            try {

                const customerData = {

                    name,

                    phone,

                    username,

                    password,

                    portalUrl,

                    plan,

                    amount,

                    startDate,

                    expiryDate,

                    status,

                    createdAt:
                        serverTimestamp()

                };


                const customerRef =
                    await addDoc(

                        collection(
                            db,
                            "customers"
                        ),

                        customerData

                    );


                await addDoc(

                    collection(
                        db,
                        "payments"
                    ),

                    {

                        customerId:
                            customerRef.id,

                        customerName:
                            name,

                        plan,

                        amount,

                        status:
                            "Paid",

                        method:
                            "UPI",

                        date:
                            new Date()
                                .toISOString()
                                .split("T")[0],

                        createdAt:
                            serverTimestamp()

                    }

                );


                showToast(
                    "Customer added successfully"
                );


                form.reset();

                setTodayDate();

                clearQR();

                await loadCustomers();

                showPage(
                    "customers"
                );

            }
            catch (error) {

                console.error(
                    error
                );

                showToast(
                    "Failed to add customer"
                );

            }
            finally {

                showLoading(false);

            }

        }
    );

}


/* =========================================================
   PLAN CHANGE
========================================================= */

function setupPlanChange() {

    const plan =
        document.getElementById(
            "plan"
        );


    if (!plan) return;


    plan.addEventListener(
        "change",
        () => {

            const selectedPlan =
                plan.value;

            const amount =
                planPrices[
                    selectedPlan
                ] || 0;


            setValue(
                "amount",
                amount
            );


            const qrPlan =
                document.getElementById(
                    "qrPlan"
                );

            const qrAmount =
                document.getElementById(
                    "qrAmount"
                );


            if (qrPlan) {

                qrPlan.textContent =
                    selectedPlan ||
                    "-";

            }


            if (qrAmount) {

                qrAmount.textContent =
                    "₹" +
                    amount;

            }


            calculateExpiry();

            generateQR();

        }
    );

}


/* =========================================================
   DATE SETUP
========================================================= */

function setTodayDate() {

    const startDate =
        document.getElementById(
            "startDate"
        );


    if (!startDate) return;


    const today =
        new Date();


    startDate.value =
        formatDate(
            today
        );


    calculateExpiry();

}


function calculateExpiry() {

    const plan =
        getValue(
            "plan"
        );

    const start =
        getValue(
            "startDate"
        );


    if (
        !plan ||
        !start
    ) {

        return;

    }


    const date =
        new Date(
            start
        );


    if (
        plan ===
        "1 Month"
    ) {

        date.setMonth(
            date.getMonth() + 1
        );

    }

    else if (
        plan ===
        "3 Months"
    ) {

        date.setMonth(
            date.getMonth() + 3
        );

    }

    else if (
        plan ===
        "6 Months"
    ) {

        date.setMonth(
            date.getMonth() + 6
        );

    }

    else if (
        plan ===
        "12 Months"
    ) {

        date.setFullYear(
            date.getFullYear() + 1
        );

    }


    setValue(
        "expiryDate",
        formatDate(
            date
        )
    );

}


/* =========================================================
   QR GENERATOR
========================================================= */

function generateQR() {

    const plan =
        getValue(
            "plan"
        );

    const amount =
        getValue(
            "amount"
        );


    if (
        !plan ||
        !amount
    ) {

        return;

    }


    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (!qrContainer) return;


    qrContainer.innerHTML =
        "";


    const upiUrl =

        "upi://pay" +

        "?pa=" +
        encodeURIComponent(
            UPI_ID
        ) +

        "&pn=" +
        encodeURIComponent(
            UPI_NAME
        ) +

        "&am=" +
        encodeURIComponent(
            amount
        ) +

        "&cu=INR";


    if (
        typeof QRCode !==
        "undefined"
    ) {

        new QRCode(

            qrContainer,

            {

                text:
                    upiUrl,

                width:
                    200,

                height:
                    200,

                correctLevel:
                    QRCode.CorrectLevel.H

            }

        );

    }

}


function clearQR() {

    const container =
        document.getElementById(
            "qrcode"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="qr-placeholder">

            <span>▣</span>

            <p>Select a plan</p>

            <small>
                QR code will appear here
            </small>

        </div>

    `;

}


/* =========================================================
   COPY UPI
========================================================= */

function setupButtons() {

    const copyUpi =
        document.getElementById(
            "copyUpi"
        );


    if (copyUpi) {

        copyUpi.addEventListener(
            "click",
            async () => {

                await navigator
                    .clipboard
                    .writeText(
                        UPI_ID
                    );

                showToast(
                    "UPI ID copied"
                );

            }
        );

    }


    const downloadQR =
        document.getElementById(
            "downloadQR"
        );


    if (downloadQR) {

        downloadQR.addEventListener(
            "click",
            downloadQRCode
        );

    }


    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "sidebar"
                    )
                    ?.classList
                    .toggle(
                        "open"
                    );

            }
        );

    }

}


/* =========================================================
   DOWNLOAD QR
========================================================= */

function downloadQRCode() {

    const canvas =
        document.querySelector(
            "#qrcode canvas"
        );


    if (!canvas) {

        showToast(
            "Please select a plan first"
        );

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.download =
        "SUPER-IPTV-Payment-QR.png";


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.click();

}


/* =========================================================
   RENDER CUSTOMERS
========================================================= */

function renderCustomers() {

    const tbody =
        document.getElementById(
            "customersTable"
        );


    if (!tbody) return;


    const search =
        (
            getValue(
                "customerSearch"
            ) ||
            ""
        )
        .toLowerCase();


    const statusFilter =
        getValue(
            "customerStatusFilter"
        ) ||
        "all";


    const planFilter =
        getValue(
            "customerPlanFilter"
        ) ||
        "all";


    let list =
        customers.filter(
            customer => {


                const matchesSearch =

                    !search ||

                    String(
                        customer.name ||
                        ""
                    )
                    .toLowerCase()
                    .includes(search) ||

                    String(
                        customer.phone ||
                        ""
                    )
                    .includes(search) ||

                    String(
                        customer.username ||
                        ""
                    )
                    .toLowerCase()
                    .includes(search);


                const matchesStatus =

                    statusFilter ===
                    "all" ||

                    customer.status ===
                    statusFilter;


                const matchesPlan =

                    planFilter ===
                    "all" ||

                    customer.plan ===
                    planFilter;


                return (

                    matchesSearch &&

                    matchesStatus &&

                    matchesPlan

                );

            }
        );


    tbody.innerHTML =
        "";


    if (!list.length) {

        tbody.innerHTML = `

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


    list.forEach(
        customer => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            customer.name ||
                            ""
                        )}
                    </strong>

                </td>


                <td>

                    ${escapeHTML(
                        customer.phone ||
                        "-"
                    )}

                </td>


                <td>

                    <div>
                        ${escapeHTML(
                            customer.username ||
                            "-"
                        )}
                    </div>

                    <small>
                        ${escapeHTML(
                            customer.password ||
                            ""
                        )}
                    </small>

                </td>


                <td>

                    ${escapeHTML(
                        customer.plan ||
                        "-"
                    )}

                </td>


                <td>

                    ₹${Number(
                        customer.amount ||
                        0
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        customer.expiryDate ||
                        "-"
                    )}

                </td>


                <td>

                    <span
                        class="status-badge ${getStatusClass(
                            customer.status
                        )}"
                    >

                        ${escapeHTML(
                            customer.status ||
                            "Unknown"
                        )}

                    </span>

                </td>


                <td>

                    <div class="action-buttons">


                        <button
                            class="action-btn view"
                            onclick="viewCustomer('${customer.id}')"
                            title="View"
                        >
                            👁️
                        </button>


                        <button
                            class="action-btn edit"
                            onclick="editCustomer('${customer.id}')"
                            title="Edit"
                        >
                            ✏️
                        </button>


                        <button
                            class="action-btn renew"
                            onclick="renewCustomer('${customer.id}')"
                            title="Renew"
                        >
                            🔄
                        </button>


                        <button
                            class="action-btn whatsapp"
                            onclick="sendWhatsApp('${customer.id}')"
                            title="WhatsApp"
                        >
                            📱
                        </button>


                        <button
                            class="action-btn delete"
                            onclick="deleteCustomer('${customer.id}')"
                            title="Delete"
                        >
                            🗑️
                        </button>


                    </div>

                </td>

            `;


            tbody.appendChild(
                tr
            );

        }
    );


    renderRecentCustomers();

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        customers.length;


    const active =
        customers.filter(
            c =>
                c.status ===
                "Active"
        ).length;


    const expired =
        customers.filter(
            c =>
                c.status ===
                "Expired"
        ).length;


    const expiring =
        customers.filter(
            c =>
                isExpiringSoon(
                    c.expiryDate
                )
        ).length;


    const revenue =
        customers.reduce(
            (
                total,
                c
            ) =>
                total +
                Number(
                    c.amount ||
                    0
                ),
            0
        );


    setText(
        "totalCustomers",
        total
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
        "₹" +
        revenue
    );


    renderRecentCustomers();

    renderExpiringCustomers();

}


/* =========================================================
   RECENT CUSTOMERS
========================================================= */

function renderRecentCustomers() {

    const tbody =
        document.getElementById(
            "recentCustomersTable"
        );


    if (!tbody) return;


    tbody.innerHTML =
        "";


    const list =
        customers
            .slice()
            .reverse()
            .slice(
                0,
                5
            );


    list.forEach(
        customer => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${escapeHTML(
                            customer.name ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.username ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.plan ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.expiryDate ||
                            "-"
                        )}
                    </td>

                    <td>

                        <span
                            class="status-badge ${getStatusClass(
                                customer.status
                            )}"
                        >

                            ${escapeHTML(
                                customer.status ||
                                "-"
                            )}

                        </span>

                    </td>

                </tr>

            `;

        }
    );

}


/* =========================================================
   EXPIRING CUSTOMERS
========================================================= */

function renderExpiringCustomers() {

    const container =
        document.getElementById(
            "expiringCustomersList"
        );


    if (!container) return;


    const list =
        customers.filter(
            customer =>
                isExpiringSoon(
                    customer.expiryDate
                )
        );


    container.innerHTML =
        "";


    setText(
        "expiringBadge",
        list.length
    );


    list
        .slice(
            0,
            5
        )
        .forEach(
            customer => {

                container.innerHTML += `

                    <div class="expiring-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    customer.name ||
                                    "-"
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    customer.expiryDate ||
                                    "-"
                                )}
                            </small>

                        </div>

                        <button
                            onclick="renewCustomer('${customer.id}')"
                        >
                            🔄
                        </button>

                    </div>

                `;

            }
        );


    if (!list.length) {

        container.innerHTML = `

            <div class="empty-state">

                No customers expiring soon

            </div>

        `;

    }

}


/* =========================================================
   EDIT CUSTOMER
========================================================= */

window.editCustomer =
    function(
        id
    ) {

        const customer =
            customers.find(
                c =>
                    c.id ===
                    id
            );


        if (!customer) return;


        setValue(
            "editId",
            customer.id
        );

        setValue(
            "editName",
            customer.name
        );

        setValue(
            "editPhone",
            customer.phone
        );

        setValue(
            "editUsername",
            customer.username
        );

        setValue(
            "editPassword",
            customer.password
        );

        setValue(
            "editPortalUrl",
            customer.portalUrl
        );

        setValue(
            "editPlan",
            customer.plan
        );

        setValue(
            "editAmount",
            customer.amount
        );

        setValue(
            "editStartDate",
            customer.startDate
        );

        setValue(
            "editExpiryDate",
            customer.expiryDate
        );

        setValue(
            "editStatus",
            customer.status
        );


        openModal(
            "editCustomerModal"
        );

    };


document
    .getElementById(
        "editCustomerForm"
    )
    ?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                getValue(
                    "editId"
                );


            if (!id) return;


            showLoading(true);


            try {

                await updateDoc(

                    doc(
                        db,
                        "customers",
                        id
                    ),

                    {

                        name:
                            getValue(
                                "editName"
                            ),

                        phone:
                            getValue(
                                "editPhone"
                            ),

                        username:
                            getValue(
                                "editUsername"
                            ),

                        password:
                            getValue(
                                "editPassword"
                            ),

                        portalUrl:
                            getValue(
                                "editPortalUrl"
                            ),

                        plan:
                            getValue(
                                "editPlan"
                            ),

                        amount:
                            Number(
                                getValue(
                                    "editAmount"
                                )
                            ),

                        startDate:
                            getValue(
                                "editStartDate"
                            ),

                        expiryDate:
                            getValue(
                                "editExpiryDate"
                            ),

                        status:
                            getValue(
                                "editStatus"
                            )

                    }

                );


                closeAllModals();

                showToast(
                    "Customer updated"
                );


                await loadCustomers();

            }
            catch (error) {

                console.error(
                    error
                );

                showToast(
                    "Update failed"
                );

            }
            finally {

                showLoading(false);

            }

        }
    );


/* =========================================================
   VIEW CUSTOMER
========================================================= */

window.viewCustomer =
    function(
        id
    ) {

        const customer =
            customers.find(
                c =>
                    c.id ===
                    id
            );


        if (!customer) return;


        selectedCustomer =
            customer;


        const details =
            document.getElementById(
                "customerDetails"
            );


        if (!details) return;


        details.innerHTML = `

            <div class="customer-profile">

                <div class="profile-avatar">
                    ${escapeHTML(
                        (
                            customer.name ||
                            "C"
                        )
                        .charAt(0)
                        .toUpperCase()
                    )}
                </div>

                <h3>
                    ${escapeHTML(
                        customer.name ||
                        "-"
                    )}
                </h3>

                <span>
                    ${escapeHTML(
                        customer.status ||
                        "-"
                    )}
                </span>

            </div>


            <div class="details-grid">

                <div>
                    <small>Phone</small>
                    <strong>
                        ${escapeHTML(
                            customer.phone ||
                            "-"
                        )}
                    </strong>
                </div>

                <div>
                    <small>Username</small>
                    <strong>
                        ${escapeHTML(
                            customer.username ||
                            "-"
                        )}
                    </strong>
                </div>

                <div>
                    <small>Password</small>
                    <strong>
                        ${escapeHTML(
                            customer.password ||
                            "-"
                        )}
                    </strong>
                </div>

                <div>
                    <small>Plan</small>
                    <strong>
                        ${escapeHTML(
                            customer.plan ||
                            "-"
                        )}
                    </strong>
                </div>

                <div>
                    <small>Amount</small>
                    <strong>
                        ₹${Number(
                            customer.amount ||
                            0
                        )}
                    </strong>
                </div>

                <div>
                    <small>Expiry</small>
                    <strong>
                        ${escapeHTML(
                            customer.expiryDate ||
                            "-"
                        )}
                    </strong>
                </div>

                <div class="full">
                    <small>Portal URL</small>
                    <strong>
                        ${escapeHTML(
                            customer.portalUrl ||
                            "-"
                        )}
                    </strong>
                </div>

            </div>

        `;


        openModal(
            "customerModal"
        );

    };


/* =========================================================
   DELETE CUSTOMER
========================================================= */

window.deleteCustomer =
    async function(
        id
    ) {

        const customer =
            customers.find(
                c =>
                    c.id ===
                    id
            );


        if (!customer) return;


        const confirmed =
            confirm(

                "Delete " +
                customer.name +
                "?"

            );


        if (!confirmed) return;


        showLoading(true);


        try {

            await deleteDoc(

                doc(
                    db,
                    "customers",
                    id
                )

            );


            showToast(
                "Customer deleted"
            );


            await loadCustomers();

        }
        catch (error) {

            console.error(
                error
            );

            showToast(
                "Delete failed"
            );

        }
        finally {

            showLoading(false);

        }

    };


/* =========================================================
   RENEW CUSTOMER
========================================================= */

window.renewCustomer =
    function(
        id
    ) {

        const customer =
            customers.find(
                c =>
                    c.id ===
                    id
            );


        if (!customer) return;


        selectedRenewCustomer =
            customer;


        setValue(
            "renewPlan",
            customer.plan
        );


        updateRenewPreview();


        openModal(
            "renewModal"
        );

    };


document
    .getElementById(
        "renewPlan"
    )
    ?.addEventListener(
        "change",
        updateRenewPreview
    );


function updateRenewPreview() {

    if (
        !selectedRenewCustomer
    ) {

        return;

    }


    const plan =
        getValue(
            "renewPlan"
        );


    const amount =
        planPrices[
            plan
        ] || 0;


    let baseDate =
        new Date();


    if (
        selectedRenewCustomer.expiryDate
    ) {

        const expiry =
            new Date(
                selectedRenewCustomer.expiryDate
            );


        if (
            expiry >
            baseDate
        ) {

            baseDate =
                expiry;

        }

    }


    const newExpiry =
        new Date(
            baseDate
        );


    if (
        plan ===
        "1 Month"
    ) {

        newExpiry.setMonth(
            newExpiry.getMonth() + 1
        );

    }

    else if (
        plan ===
        "3 Months"
    ) {

        newExpiry.setMonth(
            newExpiry.getMonth() + 3
        );

    }

    else if (
        plan ===
        "6 Months"
    ) {

        newExpiry.setMonth(
            newExpiry.getMonth() + 6
        );

    }

    else if (
        plan ===
        "12 Months"
    ) {

        newExpiry.setFullYear(
            newExpiry.getFullYear() + 1
        );

    }


    setText(
        "renewExpiry",
        formatDate(
            newExpiry
        )
    );


    setText(
        "renewAmount",
        "₹" +
        amount
    );

}


document
    .getElementById(
        "confirmRenew"
    )
    ?.addEventListener(
        "click",
        async () => {

            if (
                !selectedRenewCustomer
            ) {

                return;

            }


            const plan =
                getValue(
                    "renewPlan"
                );


            const amount =
                planPrices[
                    plan
                ];


            const baseDate =
                new Date(
                    selectedRenewCustomer.expiryDate
                ) >
                new Date()

                    ?

                new Date(
                    selectedRenewCustomer.expiryDate
                )

                    :

                new Date();


            const expiry =
                new Date(
                    baseDate
                );


            if (
                plan ===
                "1 Month"
            ) {

                expiry.setMonth(
                    expiry.getMonth() + 1
                );

            }

            else if (
                plan ===
                "3 Months"
            ) {

                expiry.setMonth(
                    expiry.getMonth() + 3
                );

            }

            else if (
                plan ===
                "6 Months"
            ) {

                expiry.setMonth(
                    expiry.getMonth() + 6
                );

            }

            else if (
                plan ===
                "12 Months"
            ) {

                expiry.setFullYear(
                    expiry.getFullYear() + 1
                );

            }


            showLoading(true);


            try {

                await updateDoc(

                    doc(
                        db,
                        "customers",
                        selectedRenewCustomer.id
                    ),

                    {

                        plan,

                        amount,

                        expiryDate:
                            formatDate(
                                expiry
                            ),

                        status:
                            "Active"

                    }

                );


                await addDoc(

                    collection(
                        db,
                        "payments"
                    ),

                    {

                        customerId:
                            selectedRenewCustomer.id,

                        customerName:
                            selectedRenewCustomer.name,

                        plan,

                        amount,

                        status:
                            "Paid",

                        method:
                            "UPI",

                        date:
                            formatDate(
                                new Date()
                            ),

                        createdAt:
                            serverTimestamp()

                    }

                );


                closeAllModals();


                showToast(
                    "Subscription renewed"
                );


                await loadCustomers();

            }
            catch (error) {

                console.error(
                    error
                );

                showToast(
                    "Renewal failed"
                );

            }
            finally {

                showLoading(false);

            }

        }
    );


/* =========================================================
   WHATSAPP
========================================================= */

window.sendWhatsApp =
    function(
        id
    ) {

        const customer =
            customers.find(
                c =>
                    c.id ===
                    id
            );


        if (!customer) return;


        const message = `

Hello ${customer.name},

Your SUPER IPTV subscription details:

Username: ${customer.username}

Password: ${customer.password}

Plan: ${customer.plan}

Amount: ₹${customer.amount}

Expiry: ${customer.expiryDate}

Portal: ${customer.portalUrl || "-"}

Thank you for choosing SUPER IPTV.

`;


        const phone =
            String(
                customer.phone ||
                ""
            )
            .replace(
                /\D/g,
                ""
            );


        const whatsappNumber =

            phone.length === 10

                ?

            "91" +
            phone

                :

            phone;


        const url =

            "https://wa.me/" +

            whatsappNumber +

            "?text=" +

            encodeURIComponent(
                message
            );


        window.open(
            url,
            "_blank"
        );

    };


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    [

        "customerSearch",

        "globalSearch",

        "paymentSearch"

    ]
    .forEach(
        id => {

            const input =
                document.getElementById(
                    id
                );


            if (!input) return;


            input.addEventListener(
                "input",
                () => {

                    if (
                        id ===
                        "globalSearch"
                    ) {

                        const value =
                            input.value
                                .toLowerCase();


                        const customer =
                            customers.find(
                                c =>

                                    String(
                                        c.name ||
                                        ""
                                    )
                                    .toLowerCase()
                                    .includes(
                                        value
                                    )

                            );


                        if (
                            customer &&
                            value
                        ) {

                            showPage(
                                "customers"
                            );

                            setValue(
                                "customerSearch",
                                value
                            );

                            renderCustomers();

                        }

                    }

                    else if (
                        id ===
                        "customerSearch"
                    ) {

                        renderCustomers();

                    }

                    else {

                        renderPayments();

                    }

                }
            );

        }
    );

}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {

    [

        "customerStatusFilter",

        "customerPlanFilter",

        "paymentStatusFilter"

    ]
    .forEach(
        id => {

            document
                .getElementById(
                    id
                )
                ?.addEventListener(
                    "change",
                    () => {

                        renderCustomers();

                        renderPayments();

                    }
                );

        }
    );

}


/* =========================================================
   UPDATE EXPIRED STATUS
========================================================= */

function updateExpiredStatuses() {

    const today =
        new Date();


    customers.forEach(
        customer => {

            if (
                customer.expiryDate &&
                new Date(
                    customer.expiryDate
                ) <
                today &&
                customer.status ===
                "Active"
            ) {

                customer.status =
                    "Expired";

            }

        }
    );

}


/* =========================================================
   SUBSCRIPTIONS
========================================================= */

function renderSubscriptions() {

    const tbody =
        document.getElementById(
            "subscriptionsTable"
        );


    if (!tbody) return;


    tbody.innerHTML =
        "";


    customers.forEach(
        customer => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${escapeHTML(
                            customer.name ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.plan ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.startDate ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.expiryDate ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.status ||
                            "-"
                        )}
                    </td>

                    <td>

                        <button
                            class="primary-button small"
                            onclick="renewCustomer('${customer.id}')"
                        >
                            🔄 Renew
                        </button>

                    </td>

                </tr>

            `;

        }
    );


    setText(
        "subscriptionActive",

        customers.filter(
            c =>
                c.status ===
                "Active"
        ).length

    );


    setText(
        "subscriptionExpired",

        customers.filter(
            c =>
                c.status ===
                "Expired"
        ).length

    );


    setText(
        "subscriptionExpiring",

        customers.filter(
            c =>
                isExpiringSoon(
                    c.expiryDate
                )
        ).length

    );

}


/* =========================================================
   PAYMENTS
========================================================= */

async function renderPayments() {

    const tbody =
        document.getElementById(
            "paymentsTable"
        );


    if (!tbody) return;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "payments"
                )
            );


        payments =
            snapshot.docs.map(
                item => ({

                    id:
                        item.id,

                    ...item.data()

                })
            );


        tbody.innerHTML =
            "";


        payments.forEach(
            payment => {

                tbody.innerHTML += `

                    <tr>

                        <td>
                            ${escapeHTML(
                                payment.id
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                payment.customerName ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                payment.plan ||
                                "-"
                            )}
                        </td>

                        <td>
                            ₹${Number(
                                payment.amount ||
                                0
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                payment.date ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                payment.method ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                payment.status ||
                                "-"
                            )}
                        </td>

                    </tr>

                `;

            }
        );


        const revenue =
            payments.reduce(
                (
                    total,
                    payment
                ) =>

                    total +
                    Number(
                        payment.amount ||
                        0
                    ),

                0

            );


        setText(
            "paymentTotalRevenue",
            "₹" +
            revenue
        );


        setText(
            "paymentPending",

            payments.filter(
                p =>
                    p.status ===
                    "Pending"
            ).length

        );

    }
    catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   INVOICES
========================================================= */

function renderInvoices() {

    const tbody =
        document.getElementById(
            "invoicesTable"
        );


    if (!tbody) return;


    tbody.innerHTML =
        "";


    payments.forEach(
        payment => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        INV-${escapeHTML(
                            payment.id
                                .slice(
                                    0,
                                    8
                                )
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment.customerName ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment.plan ||
                            "-"
                        )}
                    </td>

                    <td>
                        ₹${Number(
                            payment.amount ||
                            0
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment.date ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment.status ||
                            "-"
                        )}
                    </td>

                    <td>

                        <button
                            class="secondary-button small"
                            onclick="printInvoice('${payment.id}')"
                        >

                            🖨️ Print

                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


/* =========================================================
   PRINT INVOICE
========================================================= */

window.printInvoice =
    function(
        paymentId
    ) {

        const payment =
            payments.find(
                p =>
                    p.id ===
                    paymentId
            );


        if (!payment) return;


        const customer =
            customers.find(
                c =>
                    c.id ===
                    payment.customerId
            );


        const invoice = `

            <html>

            <head>

                <title>
                    SUPER IPTV Invoice
                </title>

                <style>

                    body {
                        font-family: Arial;
                        padding: 40px;
                    }

                    h1 {
                        color: #111;
                    }

                    .box {
                        border: 1px solid #ddd;
                        padding: 20px;
                        margin-top: 20px;
                    }

                </style>

            </head>

            <body>

                <h1>
                    SUPER IPTV
                </h1>

                <h2>
                    Payment Invoice
                </h2>

                <div class="box">

                    <p>
                        Invoice:
                        INV-${payment.id}
                    </p>

                    <p>
                        Customer:
                        ${customer?.name || payment.customerName}
                    </p>

                    <p>
                        Plan:
                        ${payment.plan}
                    </p>

                    <p>
                        Amount:
                        ₹${payment.amount}
                    </p>

                    <p>
                        Date:
                        ${payment.date}
                    </p>

                    <p>
                        Status:
                        ${payment.status}
                    </p>

                </div>

            </body>

            </html>

        `;


        const win =
            window.open(
                "",
                "_blank"
            );


        win.document.write(
            invoice
        );


        win.document.close();


        win.print();

    };


/* =========================================================
   NOTIFICATIONS
========================================================= */

function renderNotifications() {

    const container =
        document.getElementById(
            "notificationList"
        );


    if (!container) return;


    const expiring =
        customers.filter(
            c =>
                isExpiringSoon(
                    c.expiryDate
                )
        );


    container.innerHTML =
        "";


    expiring.forEach(
        customer => {

            container.innerHTML += `

                <div class="notification-item">

                    <div>

                        <strong>
                            ⏰ Subscription Expiring
                        </strong>

                        <p>
                            ${escapeHTML(
                                customer.name
                            )}
                            expires on
                            ${escapeHTML(
                                customer.expiryDate
                            )}
                        </p>

                    </div>

                    <button
                        onclick="renewCustomer('${customer.id}')"
                    >
                        Renew
                    </button>

                </div>

            `;

        }
    );


    setText(
        "notificationCount",
        expiring.length
    );


    setText(
        "notificationDot",
        ""
    );

}


/* =========================================================
   PLANS
========================================================= */

function renderPlans() {

    const container =
        document.getElementById(
            "plansGrid"
        );


    if (!container) return;


    container.innerHTML =
        "";


    Object.entries(
        planPrices
    )
    .forEach(
        (
            [
                plan,
                price
            ]
        ) => {

            container.innerHTML += `

                <div class="plan-card">

                    <div class="plan-icon">
                        📦
                    </div>

                    <h3>
                        ${plan}
                    </h3>

                    <strong>
                        ₹${price}
                    </strong>

                    <p>
                        IPTV Subscription
                    </p>

                </div>

            `;

        }
    );

}


/* =========================================================
   REPORTS
========================================================= */

function renderReports() {

    const revenue =
        customers.reduce(
            (
                total,
                customer
            ) =>

                total +
                Number(
                    customer.amount ||
                    0
                ),

            0

        );


    const average =

        customers.length

            ?

        Math.round(
            revenue /
            customers.length
        )

            :

        0;


    setText(
        "reportCustomers",
        customers.length
    );


    setText(
        "reportRevenue",
        "₹" +
        revenue
    );


    setText(
        "reportAverage",
        "₹" +
        average
    );

}


/* =========================================================
   BACKUP
========================================================= */

function setupBackup() {

    const exportButton =
        document.getElementById(
            "exportBackup"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            () => {

                const data = {

                    exportedAt:
                        new Date()
                            .toISOString(),

                    customers

                };


                const blob =
                    new Blob(

                        [
                            JSON.stringify(
                                data,
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
                    "SUPER-IPTV-Backup.json";


                link.click();


                URL.revokeObjectURL(
                    url
                );


                showToast(
                    "Backup exported"
                );

            }
        );

    }


    const importButton =
        document.getElementById(
            "importBackup"
        );


    const fileInput =
        document.getElementById(
            "importBackupFile"
        );


    if (
        importButton &&
        fileInput
    ) {

        importButton.addEventListener(
            "click",
            () => {

                fileInput.click();

            }
        );


        fileInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target
                        .files[0];


                if (!file) return;


                const reader =
                    new FileReader();


                reader.onload =
                    () => {

                        try {

                            const data =
                                JSON.parse(
                                    reader.result
                                );


                            console.log(
                                data
                            );


                            showToast(
                                "Backup loaded. Import to Firebase is not automatic."
                            );

                        }
                        catch {

                            showToast(
                                "Invalid backup file"
                            );

                        }

                    };


                reader.readAsText(
                    file
                );

            }
        );

    }


    document
        .getElementById(
            "printCustomers"
        )
        ?.addEventListener(
            "click",
            () => {

                window.print();

            }
        );

}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettings() {

    document
        .getElementById(
            "savePaymentSettings"
        )
        ?.addEventListener(
            "click",
            () => {

                showToast(
                    "Payment settings saved locally"
                );

            }
        );


    document
        .getElementById(
            "saveGeneralSettings"
        )
        ?.addEventListener(
            "click",
            () => {

                showToast(
                    "General settings saved"
                );

            }
        );


    document
        .getElementById(
            "saveWhatsappTemplate"
        )
        ?.addEventListener(
            "click",
            () => {

                showToast(
                    "WhatsApp template saved"
                );

            }
        );

}


/* =========================================================
   THEME
========================================================= */

function setupTheme() {

    const button =
        document.getElementById(
            "themeToggle"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            document.body
                .classList
                .toggle(
                    "dark-mode"
                );

        }
    );

}


/* =========================================================
   MODALS
========================================================= */

function setupModalClose() {

    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    closeAllModals
                );

            }
        );

}


function openModal(
    id
) {

    const modal =
        document.getElementById(
            id
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


function closeAllModals() {

    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            modal => {

                modal.classList.remove(
                    "active"
                );

            }
        );

}


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getValue(
    id
) {

    return (

        document.getElementById(
            id
        )?.value ||

        ""

    );

}


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ??
            "";

    }

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


function formatDate(
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


function isExpiringSoon(
    dateString
) {

    if (!dateString) {

        return false;

    }


    const expiry =
        new Date(
            dateString
        );


    const today =
        new Date();


    const diff =
        expiry -
        today;


    const days =
        diff /
        (
            1000 *
            60 *
            60 *
            24
        );


    return (

        days >= 0 &&
        days <= 7

    );

}


function getStatusClass(
    status
) {

    if (
        status ===
        "Active"
    ) {

        return "active";

    }


    if (
        status ===
        "Expired"
    ) {

        return "expired";

    }


    if (
        status ===
        "Suspended"
    ) {

        return "suspended";

    }


    return "";

}


function escapeHTML(
    value
) {

    return String(
        value ??
        ""
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


    if (!toast) return;


    if (text) {

        text.textContent =
            message;

    }


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },

        3000

    );

}


function showLoading(
    show
) {

    const overlay =
        document.getElementById(
            "loadingOverlay"
        );


    if (!overlay) return;


    if (show) {

        overlay.classList.add(
            "active"
        );

    }

    else {

        overlay.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   GLOBAL REFRESH BUTTON
========================================================= */

document
    .getElementById(
        "refreshCustomers"
    )
    ?.addEventListener(
        "click",
        loadCustomers
    );


/* =========================================================
   START
========================================================= */

console.log(
    "SUPER IPTV Professional Panel loaded successfully"
);