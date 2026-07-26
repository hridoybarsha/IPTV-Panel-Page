/* =========================================
   SUPER IPTV MANAGEMENT PANEL
========================================= */


/* =========================================
   STORAGE
========================================= */

const USERS_KEY = "SUPER_IPTV_USERS";

const PAYMENTS_KEY = "SUPER_IPTV_PAYMENTS";

const SETTINGS_KEY = "SUPER_IPTV_SETTINGS";


let users =
    JSON.parse(localStorage.getItem(USERS_KEY)) || [];

let payments =
    JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];

let settings =
    JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {

        upi: "6289033804@ptsbi"

    };


/* =========================================
   PLAN PRICES
========================================= */

const planPrices = {

    "1 Month": 200,

    "3 Months": 600,

    "6 Months": 1150,

    "12 Months": 2000

};


/* =========================================
   ELEMENTS
========================================= */

const menuItems =
    document.querySelectorAll(".menu-item");

const pages =
    document.querySelectorAll(".page");

const pageTitle =
    document.getElementById("pageTitle");

const sidebar =
    document.getElementById("sidebar");

const menuToggle =
    document.getElementById("menuToggle");

const themeToggle =
    document.getElementById("themeToggle");


/* =========================================
   NAVIGATION
========================================= */

function showPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    menuItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageId) {

            item.classList.add("active");

        }

    });


    const activeMenu =
        document.querySelector(
            `.menu-item[data-page="${pageId}"]`
        );


    if (activeMenu) {

        pageTitle.textContent =
            activeMenu.innerText.trim();

    }


    sidebar.classList.remove("open");

    window.scrollTo(0, 0);

}


menuItems.forEach(item => {

    item.addEventListener("click", () => {

        showPage(item.dataset.page);

    });

});


document.querySelectorAll("[data-page-link]")
.forEach(button => {

    button.addEventListener("click", () => {

        showPage(
            button.dataset.pageLink
        );

    });

});


menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


/* =========================================
   THEME
========================================= */

const savedTheme =
    localStorage.getItem("SUPER_IPTV_THEME");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "SUPER_IPTV_THEME",
        isDark ? "dark" : "light"
    );

});


/* =========================================
   SAVE STORAGE
========================================= */

function saveData() {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );


    localStorage.setItem(
        PAYMENTS_KEY,
        JSON.stringify(payments)
    );


    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

}


/* =========================================
   EXPIRY DATE
========================================= */

function calculateExpiry(plan) {

    const date = new Date();


    if (plan === "1 Month") {

        date.setMonth(
            date.getMonth() + 1
        );

    }


    if (plan === "3 Months") {

        date.setMonth(
            date.getMonth() + 3
        );

    }


    if (plan === "6 Months") {

        date.setMonth(
            date.getMonth() + 6
        );

    }


    if (plan === "12 Months") {

        date.setFullYear(
            date.getFullYear() + 1
        );

    }


    return date.toISOString()
        .split("T")[0];

}


/* =========================================
   STATUS
========================================= */

function getStatus(expiry) {

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    const expiryDate =
        new Date(expiry);


    return expiryDate >= today
        ? "Active"
        : "Expired";

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const total =
        users.length;


    const active =
        users.filter(
            user =>
                getStatus(user.expiry) === "Active"
        ).length;


    const expired =
        users.filter(
            user =>
                getStatus(user.expiry) === "Expired"
        ).length;


    const revenue =
        payments
            .filter(
                payment =>
                    payment.status === "PAID"
            )
            .reduce(
                (sum, payment) =>
                    sum + Number(payment.amount),
                0
            );


    document.getElementById(
        "totalUsers"
    ).textContent = total;


    document.getElementById(
        "activeUsers"
    ).textContent = active;


    document.getElementById(
        "expiredUsers"
    ).textContent = expired;


    document.getElementById(
        "totalRevenue"
    ).textContent =
        revenue.toLocaleString("en-IN");


    document.getElementById(
        "reportUsers"
    ).textContent = total;


    document.getElementById(
        "reportActive"
    ).textContent = active;


    document.getElementById(
        "reportPayments"
    ).textContent =
        payments.length;

}


/* =========================================
   RENDER USERS
========================================= */

function renderUsers(search = "") {

    const table =
        document.getElementById(
            "usersTable"
        );


    table.innerHTML = "";


    const filteredUsers =
        users.filter(user => {

            const text =
                `${user.name}
                ${user.phone}
                ${user.username}`
                .toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    if (filteredUsers.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center">
                    No Customers Found
                </td>
            </tr>
        `;

        return;

    }


    filteredUsers.forEach(user => {

        const status =
            getStatus(user.expiry);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(user.name)}
                </strong>
            </td>

            <td>
                ${escapeHTML(user.phone || "-")}
            </td>

            <td>
                ${escapeHTML(user.username)}
            </td>

            <td>
                ${escapeHTML(user.plan)}
            </td>

            <td>
                ${user.expiry}
            </td>

            <td>

                <span class="status
                    ${status.toLowerCase()}">

                    ${status}

                </span>

            </td>

            <td>

                <button
                    class="action-btn whatsapp-btn"
                    onclick="sendWhatsApp('${user.id}')">

                    <i class="fa-brands fa-whatsapp"></i>

                </button>


                <button
                    class="action-btn delete-btn"
                    onclick="deleteUser('${user.id}')">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   RECENT USERS
========================================= */

function renderRecentUsers() {

    const table =
        document.getElementById(
            "recentUsersTable"
        );


    table.innerHTML = "";


    const recent =
        [...users]
            .reverse()
            .slice(0, 5);


    if (recent.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center">

                    No Users Yet

                </td>

            </tr>

        `;

        return;

    }


    recent.forEach(user => {

        const status =
            getStatus(user.expiry);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(user.name)}
            </td>

            <td>
                ${escapeHTML(user.username)}
            </td>

            <td>
                ${escapeHTML(user.plan)}
            </td>

            <td>
                ${user.expiry}
            </td>

            <td>

                <span class="status
                    ${status.toLowerCase()}">

                    ${status}

                </span>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   RENDER PAYMENTS
========================================= */

function renderPayments() {

    const table =
        document.getElementById(
            "paymentsTable"
        );


    table.innerHTML = "";


    if (payments.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center">

                    No Payments Yet

                </td>

            </tr>

        `;

        return;

    }


    [...payments]
        .reverse()
        .forEach(payment => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(payment.name)}
                </td>

                <td>
                    ${escapeHTML(payment.plan)}
                </td>

                <td>
                    ₹${Number(payment.amount)
                        .toLocaleString("en-IN")}
                </td>

                <td>
                    ${payment.date}
                </td>

                <td>

                    <span class="status
                        ${payment.status.toLowerCase()}">

                        ${payment.status}

                    </span>

                </td>

            `;


            table.appendChild(row);

        });

}


/* =========================================
   ADD USER
========================================= */

document.getElementById(
    "userForm"
).addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "customerName"
            ).value.trim();


        const phone =
            document.getElementById(
                "customerPhone"
            ).value.trim();


        const username =
            document.getElementById(
                "username"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value.trim();


        const portalUrl =
            document.getElementById(
                "portalUrl"
            ).value.trim();


        const plan =
            document.getElementById(
                "plan"
            ).value;


        const paymentStatus =
            document.getElementById(
                "paymentStatus"
            ).value;


        if (!name ||
            !username ||
            !password ||
            !plan) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        const amount =
            planPrices[plan];


        const expiry =
            calculateExpiry(plan);


        const user = {

            id:
                Date.now().toString(),

            name,

            phone,

            username,

            password,

            portalUrl,

            plan,

            amount,

            expiry,

            createdAt:
                new Date()
                    .toISOString()

        };


        users.push(user);


        payments.push({

            id:
                Date.now().toString(),

            userId:
                user.id,

            name,

            plan,

            amount,

            status:
                paymentStatus,

            date:
                new Date()
                    .toISOString()
                    .split("T")[0]

        });


        saveData();


        updateAll();


        alert(
            "Customer added successfully!"
        );


        this.reset();


        document.getElementById(
            "qrcode"
        ).innerHTML =
            "<span>Select a plan</span>";


        document.getElementById(
            "displayAmount"
        ).textContent = "0";


        showPage("users");

    }
);


/* =========================================
   PLAN QR
========================================= */

document.getElementById(
    "plan"
).addEventListener(
    "change",
    function() {

        const plan =
            this.value;


        const amount =
            planPrices[plan] || 0;


        document.getElementById(
            "displayAmount"
        ).textContent =
            amount;


        const qr =
            document.getElementById(
                "qrcode"
            );


        qr.innerHTML = "";


        if (!plan) {

            qr.innerHTML =
                "<span>Select a plan</span>";

            return;

        }


        const upi =
            settings.upi ||
            "6289033804@ptsbi";


        const upiLink =
            `upi://pay?pa=${encodeURIComponent(upi)}&pn=SUPER%20IPTV&am=${amount}&cu=INR`;


        new QRCode(
            qr,
            {

                text:
                    upiLink,

                width:
                    200,

                height:
                    200

            }
        );

    }
);


/* =========================================
   DOWNLOAD QR
========================================= */

document.getElementById(
    "downloadQR"
).addEventListener(
    "click",
    function() {

        const qrImage =
            document.querySelector(
                "#qrcode img"
            );


        if (!qrImage) {

            alert(
                "Please select a plan first."
            );

            return;

        }


        const link =
            document.createElement("a");


        link.href =
            qrImage.src;


        link.download =
            "SUPER-IPTV-UPI-QR.png";


        link.click();

    }
);


/* =========================================
   SEARCH
========================================= */

document.getElementById(
    "userSearch"
).addEventListener(
    "input",
    function() {

        renderUsers(
            this.value
        );

    }
);


/* =========================================
   DELETE USER
========================================= */

function deleteUser(id) {

    if (
        !confirm(
            "Are you sure you want to delete this customer?"
        )
    ) {

        return;

    }


    users =
        users.filter(
            user =>
                user.id !== id
        );


    payments =
        payments.filter(
            payment =>
                payment.userId !== id
        );


    saveData();


    updateAll();

}


/* =========================================
   WHATSAPP
========================================= */

function sendWhatsApp(id) {

    const user =
        users.find(
            item =>
                item.id === id
        );


    if (!user) {

        return;

    }


    let phone =
        user.phone
            .replace(/\D/g, "");


    if (
        phone.length === 10
    ) {

        phone =
            "91" + phone;

    }


    const message = `Hello ${user.name},

Your SUPER IPTV subscription details:

Username: ${user.username}

Password: ${user.password}

Plan: ${user.plan}

Amount: ₹${user.amount}

Expiry: ${user.expiry}

Portal: ${user.portalUrl || "N/A"}

Thank you for choosing SUPER IPTV.`;


    const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================
   SETTINGS
========================================= */

document.getElementById(
    "upiSettings"
).value =
    settings.upi;


document.getElementById(
    "saveSettings"
).addEventListener(
    "click",
    function() {

        settings.upi =
            document.getElementById(
                "upiSettings"
            ).value.trim();


        saveData();


        alert(
            "Settings saved successfully!"
        );

    }
);


/* =========================================
   EXPORT BACKUP
========================================= */

document.getElementById(
    "exportBackup"
).addEventListener(
    "click",
    function() {

        const backup = {

            users,

            payments,

            settings,

            exportedAt:
                new Date()
                    .toISOString()

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
            document.createElement("a");


        link.href =
            url;


        link.download =
            "SUPER-IPTV-Backup.json";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


/* =========================================
   IMPORT BACKUP
========================================= */

document.getElementById(
    "importBackup"
).addEventListener(
    "change",
    function(event) {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function(e) {

                try {

                    const backup =
                        JSON.parse(
                            e.target.result
                        );


                    if (
                        !backup.users ||
                        !backup.payments
                    ) {

                        throw new Error(
                            "Invalid backup"
                        );

                    }


                    users =
                        backup.users;


                    payments =
                        backup.payments;


                    settings =
                        backup.settings ||
                        settings;


                    saveData();


                    updateAll();


                    document.getElementById(
                        "upiSettings"
                    ).value =
                        settings.upi;


                    alert(
                        "Backup restored successfully!"
                    );

                }

                catch(error) {

                    alert(
                        "Invalid backup file."
                    );

                }

            };


        reader.readAsText(file);

    }
);


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(
            /[&<>"']/g,
            function(char) {

                const entities = {

                    "&":
                        "&amp;",

                    "<":
                        "&lt;",

                    ">":
                        "&gt;",

                    '"':
                        "&quot;",

                    "'":
                        "&#039;"

                };


                return entities[char];

            }
        );

}


/* =========================================
   UPDATE EVERYTHING
========================================= */

function updateAll() {

    updateDashboard();

    renderUsers();

    renderRecentUsers();

    renderPayments();

}


/* =========================================
   INITIALIZE
========================================= */

updateAll();