/* ==========================================
   SUPER IPTV PROFESSIONAL DASHBOARD V3
========================================== */

const USER_KEY = "SUPER_IPTV_V3_USERS";
const PAYMENT_KEY = "SUPER_IPTV_V3_PAYMENTS";
const SETTINGS_KEY = "SUPER_IPTV_V3_SETTINGS";
const THEME_KEY = "SUPER_IPTV_V3_THEME";

let users = JSON.parse(localStorage.getItem(USER_KEY)) || [];
let payments = JSON.parse(localStorage.getItem(PAYMENT_KEY)) || [];

let settings = JSON.parse(
    localStorage.getItem(SETTINGS_KEY)
) || {
    upi: "6289033804@ptsbi"
};

const prices = {
    "1 Month": 200,
    "3 Months": 600,
    "6 Months": 1150,
    "12 Months": 2000
};


/* ==========================================
   SAVE
========================================== */

function saveData(){

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(users)
    );

    localStorage.setItem(
        PAYMENT_KEY,
        JSON.stringify(payments)
    );

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );
}


/* ==========================================
   TOAST
========================================== */

function toast(message){

    const box =
        document.getElementById("toast");

    box.textContent = message;

    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

    }, 2500);
}


/* ==========================================
   PAGE NAVIGATION
========================================== */

function openPage(page){

    document
        .querySelectorAll(".page")
        .forEach(p => {

            p.classList.remove("active");

        });

    const target =
        document.getElementById(page);

    if(target){

        target.classList.add("active");

    }

    document
        .querySelector(".sidebar")
        .classList.remove("open");

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}


document.addEventListener(
    "click",
    function(e){

        const button =
            e.target.closest(
                "[data-page]"
            );

        if(button){

            openPage(
                button.dataset.page
            );

        }

    }
);


/* ==========================================
   MOBILE MENU
========================================== */

document
    .getElementById("mobileMenu")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("sidebar")
                .classList.toggle("open");

        }
    );


/* ==========================================
   THEME
========================================== */

if(
    localStorage.getItem(THEME_KEY)
    === "dark"
){

    document.body.classList.add("dark");

}


document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            document.body
                .classList.toggle("dark");

            localStorage.setItem(
                THEME_KEY,

                document.body.classList.contains(
                    "dark"
                )
                ? "dark"
                : "light"
            );

        }
    );


/* ==========================================
   DATE HELPERS
========================================== */

function addPlanDate(
    startDate,
    plan
){

    const date =
        new Date(startDate);

    if(plan === "1 Month")
        date.setMonth(
            date.getMonth() + 1
        );

    if(plan === "3 Months")
        date.setMonth(
            date.getMonth() + 3
        );

    if(plan === "6 Months")
        date.setMonth(
            date.getMonth() + 6
        );

    if(plan === "12 Months")
        date.setFullYear(
            date.getFullYear() + 1
        );

    return date
        .toISOString()
        .split("T")[0];
}


function daysLeft(expiry){

    const today =
        new Date();

    today.setHours(
        0,0,0,0
    );

    const end =
        new Date(expiry);

    return Math.ceil(
        (
            end - today
        ) /
        (
            1000 *
            60 *
            60 *
            24
        )
    );

}


function getStatus(user){

    const days =
        daysLeft(
            user.expiry
        );

    if(days < 0)
        return "expired";

    if(days <= 7)
        return "expiring";

    return "active";

}


function statusText(status){

    if(status === "active")
        return "Active";

    if(status === "expiring")
        return "Expiring Soon";

    return "Expired";

}


/* ==========================================
   CREATE CUSTOMER
========================================== */

document
    .getElementById("customerForm")
    .addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const name =
                document
                .getElementById("name")
                .value.trim();

            const phone =
                document
                .getElementById("phone")
                .value.trim();

            const username =
                document
                .getElementById("username")
                .value.trim();

            const password =
                document
                .getElementById("password")
                .value.trim();

            const portal =
                document
                .getElementById("portal")
                .value.trim();

            const plan =
                document
                .getElementById("plan")
                .value;

            const paymentStatus =
                document
                .getElementById("paymentStatus")
                .value;


            if(
                !name ||
                !phone ||
                !username ||
                !password ||
                !plan
            ){

                toast(
                    "Please fill all required fields."
                );

                return;

            }


            const id =
                Date.now().toString();

            const today =
                new Date()
                .toISOString()
                .split("T")[0];

            const expiry =
                addPlanDate(
                    today,
                    plan
                );

            const amount =
                prices[plan];


            /* CUSTOMER */

            users.push({

                id,

                name,

                phone,

                username,

                password,

                portal,

                plan,

                amount,

                startDate:
                    today,

                expiry

            });


            /* PAYMENT */

            payments.push({

                id:
                    Date.now()
                    .toString(),

                customerId:
                    id,

                customer:
                    name,

                plan,

                amount,

                status:
                    paymentStatus,

                date:
                    today

            });


            saveData();

            updateAll();

            this.reset();

            toast(
                "Customer and subscription created successfully!"
            );

            openPage(
                "customers"
            );

        }
    );


/* ==========================================
   RENDER CUSTOMERS
========================================== */

function renderCustomers(){

    const table =
        document
        .getElementById(
            "customersTable"
        );

    const search =
        document
        .getElementById(
            "customerSearch"
        )
        .value
        .toLowerCase();

    const filter =
        document
        .getElementById(
            "statusFilter"
        )
        .value;


    let data =
        users.filter(
            user => {

                const status =
                    getStatus(user);

                const text =
                    (
                        user.name +
                        user.phone +
                        user.username +
                        user.plan
                    )
                    .toLowerCase();

                const searchMatch =
                    text.includes(
                        search
                    );

                const filterMatch =
                    filter === "all"
                    ||
                    filter === status;

                return (
                    searchMatch &&
                    filterMatch
                );

            }
        );


    table.innerHTML = "";


    if(!data.length){

        table.innerHTML = `

        <tr>

            <td colspan="7"
                style="text-align:center">

                No customers found.

            </td>

        </tr>

        `;

        return;

    }


    data.forEach(
        user => {

            const status =
                getStatus(user);

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(user.name)}
                </strong>
            </td>

            <td>
                ${escapeHTML(user.phone)}
            </td>

            <td>
                ${escapeHTML(user.username)}
            </td>

            <td>
                ${escapeHTML(user.plan)}
            </td>

            <td>
                ${user.expiry}
                <small>
                    (${daysLeft(user.expiry)} days)
                </small>
            </td>

            <td>

                <span class="status ${status}">

                    ${statusText(status)}

                </span>

            </td>

            <td>

                <button
                class="action whatsapp"
                onclick="sendWhatsApp('${user.id}')">

                <i class="fa-brands fa-whatsapp"></i>

                </button>


                <button
                class="action delete"
                onclick="deleteCustomer('${user.id}')">

                <i class="fa-solid fa-trash"></i>

                </button>

            </td>

            `;

            table.appendChild(row);

        }
    );

}


/* ==========================================
   DASHBOARD
========================================== */

function updateDashboard(){

    const total =
        users.length;

    const active =
        users.filter(
            u =>
                getStatus(u)
                === "active"
        ).length;

    const expiring =
        users.filter(
            u =>
                getStatus(u)
                === "expiring"
        ).length;

    const expired =
        users.filter(
            u =>
                getStatus(u)
                === "expired"
        ).length;

    const revenue =
        payments
        .filter(
            p =>
                p.status
                === "PAID"
        )
        .reduce(
            (
                sum,
                p
            ) =>
                sum +
                Number(
                    p.amount
                ),
            0
        );


    document
        .getElementById(
            "totalCustomers"
        )
        .textContent =
        total;

    document
        .getElementById(
            "activeCustomers"
        )
        .textContent =
        active;

    document
        .getElementById(
            "expiringCustomers"
        )
        .textContent =
        expiring;

    document
        .getElementById(
            "expiredCustomers"
        )
        .textContent =
        expired;

    document
        .getElementById(
            "totalRevenue"
        )
        .textContent =
        revenue.toLocaleString(
            "en-IN"
        );


    document
        .getElementById(
            "overviewActive"
        )
        .textContent =
        active;

    document
        .getElementById(
            "overviewExpiring"
        )
        .textContent =
        expiring;

    document
        .getElementById(
            "overviewExpired"
        )
        .textContent =
        expired;

    document
        .getElementById(
            "overviewPayments"
        )
        .textContent =
        payments.length;

}


/* ==========================================
   RECENT CUSTOMERS
========================================== */

function renderRecentCustomers(){

    const table =
        document
        .getElementById(
            "recentCustomers"
        );

    table.innerHTML = "";


    users
    .slice(-5)
    .reverse()
    .forEach(
        user => {

            const status =
                getStatus(user);

            table.innerHTML += `

            <tr>

                <td>
                    ${escapeHTML(user.name)}
                </td>

                <td>
                    ${user.plan}
                </td>

                <td>
                    ${user.expiry}
                </td>

                <td>

                    <span class="status ${status}">

                        ${statusText(status)}

                    </span>

                </td>

            </tr>

            `;

        }
    );

}


/* ==========================================
   PAYMENTS
========================================== */

function renderPayments(){

    const table =
        document
        .getElementById(
            "paymentsTable"
        );

    const recent =
        document
        .getElementById(
            "recentPayments"
        );

    table.innerHTML = "";

    recent.innerHTML = "";


    payments
    .slice()
    .reverse()
    .forEach(
        payment => {

            const status =
                payment.status
                .toLowerCase();


            table.innerHTML += `

            <tr>

                <td>
                    ${escapeHTML(payment.customer)}
                </td>

                <td>
                    ${payment.plan}
                </td>

                <td>
                    ₹${Number(
                        payment.amount
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ${payment.date}
                </td>

                <td>

                    <span class="status ${status}">

                        ${payment.status}

                    </span>

                </td>

            </tr>

            `;

        }
    );


    payments
    .slice(-5)
    .reverse()
    .forEach(
        payment => {

            recent.innerHTML += `

            <tr>

                <td>
                    ${escapeHTML(payment.customer)}
                </td>

                <td>
                    ₹${payment.amount}
                </td>

                <td>

                    <span class="status
                    ${payment.status.toLowerCase()}">

                        ${payment.status}

                    </span>

                </td>

            </tr>

            `;

        }
    );

}


/* ==========================================
   DELETE CUSTOMER
========================================== */

function deleteCustomer(id){

    if(
        !confirm(
            "Delete this customer and payment records?"
        )
    ){

        return;

    }


    users =
        users.filter(
            u =>
                u.id !== id
        );


    payments =
        payments.filter(
            p =>
                p.customerId !== id
        );


    saveData();

    updateAll();

    toast(
        "Customer deleted."
    );

}


/* ==========================================
   WHATSAPP
========================================== */

function sendWhatsApp(id){

    const user =
        users.find(
            u =>
                u.id === id
        );

    if(!user)
        return;


    let phone =
        user.phone
        .replace(
            /\D/g,
            ""
        );


    if(
        phone.length === 10
    ){

        phone =
            "91" +
            phone;

    }


    const message =

`Hello ${user.name},

Your SUPER IPTV subscription details:

Username: ${user.username}
Password: ${user.password}

Plan: ${user.plan}
Amount: ₹${user.amount}

Start Date: ${user.startDate}
Expiry Date: ${user.expiry}

Portal: ${user.portal || "N/A"}

Thank you for choosing SUPER IPTV.`;


    window.open(

        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(
            message
        ),

        "_blank"

    );

}


/* ==========================================
   RENEW
========================================== */

function loadRenewCustomers(){

    const select =
        document
        .getElementById(
            "renewCustomer"
        );

    select.innerHTML =
        `<option value="">
        Select Customer
        </option>`;


    users.forEach(
        user => {

            select.innerHTML += `

            <option value="${user.id}">

                ${escapeHTML(
                    user.name
                )}
                -
                ${escapeHTML(
                    user.username
                )}

            </option>

            `;

        }
    );

}


document
    .getElementById(
        "renewBtn"
    )
    .addEventListener(
        "click",
        function(){

            const id =
                document
                .getElementById(
                    "renewCustomer"
                )
                .value;

            const plan =
                document
                .getElementById(
                    "renewPlan"
                )
                .value;


            const user =
                users.find(
                    u =>
                        u.id === id
                );


            if(!user){

                toast(
                    "Select a customer first."
                );

                return;

            }


            const today =
                new Date()
                .toISOString()
                .split("T")[0];


            let start =
                user.expiry;


            if(
                daysLeft(
                    user.expiry
                ) < 0
            ){

                start =
                    today;

            }


            user.startDate =
                start;

            user.plan =
                plan;

            user.amount =
                prices[plan];

            user.expiry =
                addPlanDate(
                    start,
                    plan
                );


            payments.push({

                id:
                    Date.now()
                    .toString(),

                customerId:
                    user.id,

                customer:
                    user.name,

                plan,

                amount:
                    prices[plan],

                status:
                    "PAID",

                date:
                    today

            });


            saveData();

            updateAll();

            loadRenewCustomers();

            toast(
                "Subscription renewed successfully!"
            );

        }
    );


/* ==========================================
   SEARCH
========================================== */

document
    .getElementById(
        "customerSearch"
    )
    .addEventListener(
        "input",
        renderCustomers
    );


document
    .getElementById(
        "statusFilter"
    )
    .addEventListener(
        "change",
        renderCustomers
    );


/* ==========================================
   SIDEBAR FILTER
========================================== */

document
    .querySelectorAll(
        "[data-filter]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function(){

                    openPage(
                        "customers"
                    );

                    document
                    .getElementById(
                        "statusFilter"
                    )
                    .value =
                    this.dataset.filter;

                    renderCustomers();

                }
            );

        }
    );


/* ==========================================
   SETTINGS
========================================== */

document
    .getElementById(
        "upiId"
    )
    .value =
    settings.upi;


document
    .getElementById(
        "saveSettings"
    )
    .addEventListener(
        "click",
        function(){

            settings.upi =
                document
                .getElementById(
                    "upiId"
                )
                .value
                .trim();

            saveData();

            toast(
                "Settings saved successfully."
            );

        }
    );


/* ==========================================
   BACKUP EXPORT
========================================== */

document
    .getElementById(
        "exportBtn"
    )
    .addEventListener(
        "click",
        function(){

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


            const a =
                document.createElement(
                    "a"
                );

            a.href =
                url;

            a.download =
                "SUPER-IPTV-V3-Backup.json";

            a.click();

            URL.revokeObjectURL(
                url
            );

            toast(
                "Backup exported."
            );

        }
    );


/* ==========================================
   BACKUP IMPORT
========================================== */

document
    .getElementById(
        "importBtn"
    )
    .addEventListener(
        "change",
        function(){

            const file =
                this.files[0];

            if(!file)
                return;


            const reader =
                new FileReader();


            reader.onload =
                function(e){

                    try{

                        const data =
                            JSON.parse(
                                e.target.result
                            );


                        if(
                            !Array.isArray(
                                data.users
                            )
                            ||
                            !Array.isArray(
                                data.payments
                            )
                        ){

                            throw new Error();

                        }


                        users =
                            data.users;

                        payments =
                            data.payments;

                        settings =
                            data.settings ||
                            settings;


                        saveData();

                        updateAll();

                        loadRenewCustomers();


                        document
                        .getElementById(
                            "upiId"
                        )
                        .value =
                        settings.upi;


                        toast(
                            "Backup restored successfully."
                        );

                    }
                    catch{

                        toast(
                            "Invalid backup file."
                        );

                    }

                };


            reader.readAsText(
                file
            );

        }
    );


/* ==========================================
   CHART
========================================== */

let revenueChart;


function createChart(){

    const canvas =
        document
        .getElementById(
            "revenueChart"
        );


    if(!canvas)
        return;


    if(revenueChart)
        revenueChart.destroy();


    const months = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"

    ];


    const data =
        months.map(
            (
                month,
                index
            ) => {

                return payments
                .filter(
                    p => {

                        if(
                            p.status
                            !== "PAID"
                        )
                            return false;


                        const date =
                            new Date(
                                p.date
                            );

                        return (
                            date
                            .getMonth()
                            === index
                        );

                    }
                )
                .reduce(
                    (
                        sum,
                        p
                    ) =>
                        sum +
                        Number(
                            p.amount
                        ),
                    0
                );

            }
        );


    revenueChart =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data:{

                    labels:
                        months,

                    datasets:[{

                        label:
                            "Revenue (₹)",

                        data,

                        borderWidth:2,

                        tension:.35,

                        fill:true

                    }]

                },

                options:{

                    responsive:true,

                    plugins:{

                        legend:{
                            display:true
                        }

                    }

                }

            }
        );

}


/* ==========================================
   REPORT CHART
========================================== */

function createReportChart(){

    const canvas =
        document
        .getElementById(
            "reportChart"
        );

    if(!canvas)
        return;


    new Chart(

        canvas,

        {

            type:
                "doughnut",

            data:{

                labels:[

                    "Active",

                    "Expiring Soon",

                    "Expired"

                ],

                datasets:[{

                    data:[

                        users.filter(
                            u =>
                            getStatus(u)
                            === "active"
                        ).length,

                        users.filter(
                            u =>
                            getStatus(u)
                            === "expiring"
                        ).length,

                        users.filter(
                            u =>
                            getStatus(u)
                            === "expired"
                        ).length

                    ]

                }]

            },

            options:{

                responsive:true

            }

        }

    );

}


/* ==========================================
   ESCAPE
========================================== */

function escapeHTML(value){

    return String(
        value || ""
    )
    .replace(
        /[&<>"']/g,
        char => ({

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

        })[char]
    );

}


/* ==========================================
   UPDATE EVERYTHING
========================================== */

function updateAll(){

    updateDashboard();

    renderCustomers();

    renderRecentCustomers();

    renderPayments();

    loadRenewCustomers();

    createChart();

}


/* ==========================================
   INITIALIZE
========================================== */

updateAll();

createReportChart();