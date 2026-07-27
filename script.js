// ======================================================
// FIREBASE IMPORTS
// ======================================================

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {

  apiKey:
    "AIzaSyCwPd-SDCABw-rCGlZrCgVc0m_dN51jzNk",

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


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);


// ======================================================
// GLOBAL DATA
// ======================================================

let customers = [];


// ======================================================
// DOM
// ======================================================

const pages =
  document.querySelectorAll(".page");

const navButtons =
  document.querySelectorAll(".nav-btn");

const pageTitle =
  document.getElementById("pageTitle");


// ======================================================
// NAVIGATION
// ======================================================

function showPage(pageId) {

  pages.forEach(page => {

    page.classList.remove("active");

  });


  const page =
    document.getElementById(pageId);

  if (page) {

    page.classList.add("active");

  }


  navButtons.forEach(button => {

    button.classList.remove("active");

    if (
      button.dataset.page === pageId
    ) {

      button.classList.add("active");

    }

  });


  const titles = {

    dashboard:
      "Dashboard",

    customers:
      "Customers",

    addCustomer:
      "Add Customer"

  };


  pageTitle.textContent =
    titles[pageId] ||
    "Dashboard";

}


// ======================================================
// NAV BUTTON CLICK
// ======================================================

navButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      showPage(
        button.dataset.page
      );

    }
  );

});


// ======================================================
// ADD CUSTOMER BUTTONS
// ======================================================

document
  .getElementById("goAddCustomer")
  .addEventListener(
    "click",
    () => {

      showPage("addCustomer");

    }
  );


document
  .getElementById("goAddCustomer2")
  .addEventListener(
    "click",
    () => {

      showPage("addCustomer");

    }
  );


// ======================================================
// PLAN PRICE
// ======================================================

const planPrices = {

  "1 Month": 200,

  "3 Months": 600,

  "6 Months": 1150,

  "12 Months": 2000

};


// ======================================================
// PLAN SELECT
// ======================================================

document
  .getElementById("plan")
  .addEventListener(
    "change",
    function () {

      const price =
        planPrices[this.value] || "";

      document
        .getElementById("amount")
        .value = price;

      calculateExpiry();

    }
  );


// ======================================================
// DATE FUNCTIONS
// ======================================================

function calculateExpiry() {

  const startInput =
    document.getElementById("startDate");

  const expiryInput =
    document.getElementById("expiryDate");

  const plan =
    document.getElementById("plan").value;


  if (
    !startInput.value ||
    !plan
  ) {

    expiryInput.value = "";

    return;

  }


  const date =
    new Date(
      startInput.value + "T00:00:00"
    );


  const months = {

    "1 Month": 1,

    "3 Months": 3,

    "6 Months": 6,

    "12 Months": 12

  };


  date.setMonth(
    date.getMonth() +
    months[plan]
  );


  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      date.getDate()
    ).padStart(2, "0");


  expiryInput.value =
    `${year}-${month}-${day}`;

}


document
  .getElementById("startDate")
  .addEventListener(
    "change",
    calculateExpiry
  );


// ======================================================
// ADD CUSTOMER
// ======================================================

document
  .getElementById("customerForm")
  .addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const customer = {

        name:
          document
            .getElementById("name")
            .value
            .trim(),

        phone:
          document
            .getElementById("phone")
            .value
            .trim(),

        username:
          document
            .getElementById("username")
            .value
            .trim(),

        password:
          document
            .getElementById("password")
            .value
            .trim(),

        portalUrl:
          document
            .getElementById("portalUrl")
            .value
            .trim(),

        plan:
          document
            .getElementById("plan")
            .value,

        amount:
          Number(
            document
              .getElementById("amount")
              .value
          ),

        startDate:
          document
            .getElementById("startDate")
            .value,

        expiryDate:
          document
            .getElementById("expiryDate")
            .value,

        status:
          document
            .getElementById("status")
            .value,

        createdAt:
          serverTimestamp()

      };


      try {

        await addDoc(

          collection(
            db,
            "customers"
          ),

          customer

        );


        showToast(
          "Customer added successfully!"
        );


        this.reset();


        document
          .getElementById("amount")
          .value = "";


        document
          .getElementById("expiryDate")
          .value = "";


        await loadCustomers();


        showPage(
          "customers"
        );


      } catch (error) {

        console.error(error);

        alert(
          "Error adding customer:\n" +
          error.message
        );

      }

    }
  );


// ======================================================
// LOAD CUSTOMERS
// ======================================================

async function loadCustomers() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "customers"
        )
      );


    customers = [];


    snapshot.forEach(
      customerDoc => {

        customers.push({

          id:
            customerDoc.id,

          ...customerDoc.data()

        });

      }
    );


    renderCustomers();

    updateDashboard();


  } catch (error) {

    console.error(
      "Firebase Error:",
      error
    );


    alert(
      "Customer data load হচ্ছে না.\n\n" +
      error.message
    );

  }

}


// ======================================================
// RENDER CUSTOMERS
// ======================================================

function renderCustomers(
  searchText = ""
) {

  const table =
    document.getElementById(
      "customersTable"
    );


  const recentTable =
    document.getElementById(
      "recentCustomersTable"
    );


  table.innerHTML = "";

  recentTable.innerHTML = "";


  const search =
    searchText
      .toLowerCase()
      .trim();


  const filtered =
    customers.filter(
      customer => {

        return (

          String(
            customer.name || ""
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            customer.phone || ""
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            customer.username || ""
          )
            .toLowerCase()
            .includes(search)

        );

      }
    );


  if (
    filtered.length === 0
  ) {

    table.innerHTML = `

      <tr>

        <td colspan="9"
            style="text-align:center">

          No Customers Found

        </td>

      </tr>

    `;

  }


  filtered.forEach(
    customer => {

      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `

        <td>
          ${escapeHTML(
            customer.name
          )}
        </td>

        <td>
          ${escapeHTML(
            customer.phone
          )}
        </td>

        <td>
          ${escapeHTML(
            customer.username
          )}
        </td>

        <td>
          ${escapeHTML(
            customer.plan
          )}
        </td>

        <td>
          ₹${Number(
            customer.amount || 0
          )}
        </td>

        <td>
          ${escapeHTML(
            customer.startDate
          )}
        </td>

        <td>
          ${escapeHTML(
            customer.expiryDate
          )}
        </td>

        <td>

          <span class="status
            ${
              customer.status ===
              "Active"
              ? "active"
              : "expired"
            }">

            ${escapeHTML(
              customer.status ||
              "Unknown"
            )}

          </span>

        </td>

        <td>

          <div class="actions">

            <button
              class="edit-btn"
              onclick="editCustomer('${customer.id}')">

              ✏️ Edit

            </button>

            <button
              class="danger-btn"
              onclick="deleteCustomer('${customer.id}')">

              🗑️ Delete

            </button>

          </div>

        </td>

      `;


      table.appendChild(
        row
      );

    }
  );


  // Recent Customers

  customers
    .slice(0, 5)
    .forEach(
      customer => {

        const row =
          document.createElement(
            "tr"
          );


        row.innerHTML = `

          <td>
            ${escapeHTML(
              customer.name
            )}
          </td>

          <td>
            ${escapeHTML(
              customer.phone
            )}
          </td>

          <td>
            ${escapeHTML(
              customer.username
            )}
          </td>

          <td>
            ${escapeHTML(
              customer.plan
            )}
          </td>

          <td>
            ${escapeHTML(
              customer.expiryDate
            )}
          </td>

          <td>

            <span class="status
              ${
                customer.status ===
                "Active"
                ? "active"
                : "expired"
              }">

              ${escapeHTML(
                customer.status ||
                "Unknown"
              )}

            </span>

          </td>

        `;


        recentTable.appendChild(
          row
        );

      }
    );

}


// ======================================================
// UPDATE DASHBOARD
// ======================================================

function updateDashboard() {

  const total =
    customers.length;


  const active =
    customers.filter(
      customer =>
        customer.status ===
        "Active"
    ).length;


  const expired =
    customers.filter(
      customer =>
        customer.status ===
        "Expired"
    ).length;


  const revenue =
    customers.reduce(
      (sum, customer) => {

        return (
          sum +
          Number(
            customer.amount || 0
          )
        );

      },
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
      "expiredCustomers"
    )
    .textContent =
    expired;


  document
    .getElementById(
      "totalRevenue"
    )
    .textContent =
    "₹" +
    revenue;

}


// ======================================================
// SEARCH
// ======================================================

document
  .getElementById(
    "searchCustomer"
  )
  .addEventListener(
    "input",
    function () {

      renderCustomers(
        this.value
      );

    }
  );


// ======================================================
// REFRESH
// ======================================================

document
  .getElementById(
    "refreshCustomers"
  )
  .addEventListener(
    "click",
    loadCustomers
  );


// ======================================================
// EDIT CUSTOMER
// ======================================================

window.editCustomer =
  function (id) {

    const customer =
      customers.find(
        item =>
          item.id === id
      );


    if (!customer) {

      return;

    }


    document
      .getElementById("editId")
      .value = id;


    document
      .getElementById("editName")
      .value =
      customer.name || "";


    document
      .getElementById("editPhone")
      .value =
      customer.phone || "";


    document
      .getElementById("editUsername")
      .value =
      customer.username || "";


    document
      .getElementById("editPassword")
      .value =
      customer.password || "";


    document
      .getElementById("editPortalUrl")
      .value =
      customer.portalUrl || "";


    document
      .getElementById("editPlan")
      .value =
      customer.plan || "1 Month";


    document
      .getElementById("editAmount")
      .value =
      customer.amount || 0;


    document
      .getElementById("editStartDate")
      .value =
      customer.startDate || "";


    document
      .getElementById("editExpiryDate")
      .value =
      customer.expiryDate || "";


    document
      .getElementById("editStatus")
      .value =
      customer.status || "Active";


    document
      .getElementById("editModal")
      .classList
      .add("show");

  };


// ======================================================
// CLOSE MODAL
// ======================================================

document
  .getElementById("closeModal")
  .addEventListener(
    "click",
    () => {

      document
        .getElementById("editModal")
        .classList
        .remove("show");

    }
  );


// ======================================================
// UPDATE CUSTOMER
// ======================================================

document
  .getElementById("editForm")
  .addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const id =
        document
          .getElementById("editId")
          .value;


      const updatedCustomer = {

        name:
          document
            .getElementById("editName")
            .value
            .trim(),

        phone:
          document
            .getElementById("editPhone")
            .value
            .trim(),

        username:
          document
            .getElementById("editUsername")
            .value
            .trim(),

        password:
          document
            .getElementById("editPassword")
            .value
            .trim(),

        portalUrl:
          document
            .getElementById("editPortalUrl")
            .value
            .trim(),

        plan:
          document
            .getElementById("editPlan")
            .value,

        amount:
          Number(
            document
              .getElementById("editAmount")
              .value
          ),

        startDate:
          document
            .getElementById("editStartDate")
            .value,

        expiryDate:
          document
            .getElementById("editExpiryDate")
            .value,

        status:
          document
            .getElementById("editStatus")
            .value

      };


      try {

        await updateDoc(

          doc(
            db,
            "customers",
            id
          ),

          updatedCustomer

        );


        showToast(
          "Customer updated successfully!"
        );


        document
          .getElementById("editModal")
          .classList
          .remove("show");


        await loadCustomers();


      } catch (error) {

        console.error(error);

        alert(
          "Update Error:\n" +
          error.message
        );

      }

    }
  );


// ======================================================
// DELETE CUSTOMER
// ======================================================

window.deleteCustomer =
  async function (id) {

    const customer =
      customers.find(
        item =>
          item.id === id
      );


    if (!customer) {

      return;

    }


    const confirmDelete =
      confirm(

        "Are you sure you want to delete:\n\n" +

        customer.name +

        "?"

      );


    if (!confirmDelete) {

      return;

    }


    try {

      await deleteDoc(

        doc(
          db,
          "customers",
          id
        )

      );


      showToast(
        "Customer deleted successfully!"
      );


      await loadCustomers();


    } catch (error) {

      console.error(error);

      alert(
        "Delete Error:\n" +
        error.message
      );

    }

  };


// ======================================================
// TOAST
// ======================================================

function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.textContent =
    message;


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


// ======================================================
// HTML SECURITY
// ======================================================

function escapeHTML(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)
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


// ======================================================
// START APP
// ======================================================

document
  .getElementById("startDate")
  .value =
  new Date()
    .toISOString()
    .split("T")[0];


loadCustomers();