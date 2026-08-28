/* ==========================================================================
   BIHARI KISAN — Order Success Page Logic
   ========================================================================== */

const API_BASE = "/biharikisan/buyer";

const ORDER_STATUS_ENDPOINT = `${API_BASE}/view-Order`;


/* ==========================================================================
   FALLBACK ORDER
   ========================================================================== */

const FALLBACK_CONFIRMED_ORDER = {

  orderId: "BK-2026-001245",

  orderDate: "2026-08-16T00:00:00.000Z",

  productName: "Desi Aloo",

  sellerName: "Piyush Kumar",

  sellerLocation: "Bihar",

  quantity: 5,

  unit: "KG",

  paymentMethod: "upi",

  total: 1050

};


/* ==========================================================================
   FORMAT RUPEES
   ========================================================================== */

function formatRupees(amount) {

  return "₹" + Number(amount).toLocaleString("en-IN");

}


/* ==========================================================================
   FORMAT DATE
   ========================================================================== */

function formatDate(isoString) {

  try {

    return new Date(isoString).toLocaleDateString("en-IN", {

      day: "numeric",

      month: "long",

      year: "numeric"

    });

  } catch {

    return isoString;

  }

}


/* ==========================================================================
   PAYMENT LABELS
   ========================================================================== */

const PAYMENT_LABELS = {

  upi: "UPI",

  card: "Debit / Credit Card",

  netbanking: "Net Banking",

  cod: "Cash on Delivery",

  wallet: "Bihari Kisan Wallet"

};


/* ==========================================================================
   LOAD CONFIRMED ORDER
   ========================================================================== */

function loadConfirmedOrder() {

  try {

    const raw = localStorage.getItem("bkConfirmedOrder");

    if (!raw) {

      return FALLBACK_CONFIRMED_ORDER;

    }

    return {

      ...FALLBACK_CONFIRMED_ORDER,

      ...JSON.parse(raw)

    };

  } catch (err) {

    console.warn(
      "Could not read confirmed order, using fallback:",
      err
    );

    return FALLBACK_CONFIRMED_ORDER;

  }

}


/* ==========================================================================
   GENERATE FARMER AVATAR
   ========================================================================== */

function generateFarmerAvatar(name) {

  if (!name) {

    return "BK";

  }


  const nameParts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);


  /*
     Example:

     Piyush Kumar
     ↓
     PK
  */

  if (nameParts.length >= 2) {

    const firstLetter =
      nameParts[0].charAt(0);

    const lastLetter =
      nameParts[nameParts.length - 1].charAt(0);

    return (
      firstLetter +
      lastLetter
    ).toUpperCase();

  }


  /*
     Example:

     Piyush
     ↓
     PI
  */

  return nameParts[0]
    .substring(0, 2)
    .toUpperCase();

}


/* ==========================================================================
   RENDER CONFIRMED ORDER
   ========================================================================== */

function renderConfirmedOrder(order) {


  /* ================= ORDER INFO ================= */

  document.getElementById("orderId").textContent =
    order.orderId;


  document.getElementById("orderDate").textContent =
    formatDate(order.orderDate);



  /* ================= FARMER NAME ================= */

  const farmerNameElement =
    document.getElementById("farmerName");


  farmerNameElement.textContent =
    order.sellerName;



  /* ================= FARMER AVATAR ================= */

  const farmerAvatarElement =
    document.getElementById("farmerAvatar");


  if (farmerAvatarElement) {

    farmerAvatarElement.textContent =
      generateFarmerAvatar(order.sellerName);

  }



  /* ================= FARMER LOCATION ================= */

  document.getElementById("farmerLocation").innerHTML =

    `<i class="fa-solid fa-location-dot"></i> ${order.sellerLocation}`;



  /* ================= PRODUCT ================= */

  document.getElementById("productName").textContent =
    order.productName;


  document.getElementById("productQty").textContent =
    `${order.quantity} ${order.unit}`;



  /* ================= PAYMENT ================= */

  document.getElementById("paymentMethod").textContent =

    PAYMENT_LABELS[order.paymentMethod] ||
    order.paymentMethod;


  document.getElementById("amountPaid").textContent =
    formatRupees(order.total);

}


/* ==========================================================================
   INITIALIZE PAGE
   ========================================================================== */

async function loadOrderFromBackend() {
  const localOrder = loadConfirmedOrder();

  try {
    const response = await fetch(
      `${ORDER_STATUS_ENDPOINT}/${localOrder.orderId}`,
      {
        credentials: "include",
        headers: { Accept: "application/json" }
      }
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Order details load nahi hue");
    }

    const backendOrder = data.order;
    const confirmedOrder = {
      orderId: backendOrder._id,
      orderDate: backendOrder.createdAt,
      productName: backendOrder.productDesc,
      sellerName: backendOrder.sellerName,
      sellerLocation: [
        backendOrder.sellerAddress?.village,
        backendOrder.sellerAddress?.district,
        backendOrder.sellerAddress?.state
      ].filter(Boolean).join(", "),
      quantity: backendOrder.quantity,
      unit: "KG",
      paymentMethod: backendOrder.paymentMethod,
      total: backendOrder.totalAmount
    };

    renderConfirmedOrder(confirmedOrder);
  } catch (error) {
    console.error("Order details load failed:", error);
    renderConfirmedOrder(localOrder);
  }
}

loadOrderFromBackend();
