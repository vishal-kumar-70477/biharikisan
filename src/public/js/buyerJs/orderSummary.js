/* ==========================================================================
   BIHARI KISAN — Order Summary Page Logic
   Address API Connected With MongoDB
   ========================================================================== */

const API_BASE = "/biharikisan/buyer";

const EDIT_ADDRESS_ENDPOINT =
    `${API_BASE}/edit-Address`;

const ADD_ADDRESS_ENDPOINT =
    `${API_BASE}/add-Address`;

const VIEW_ADDRESS_ENDPOINT =
    `${API_BASE}/view-Addresses`;


/* ==========================================================================
   FALLBACK ORDER
   ========================================================================== */

const FALLBACK_ORDER = {
    productId: "BK-CROP-1042",
    productName: "Desi Aloo",
    productImage:
        "https://images.unsplash.com/photo-1552642986-ccb41e7059e7?q=80&w=300&auto=format&fit=crop",
    sellerName: "Piyush Kumar",
    sellerLocation: "Bihar",
    quantity: 5,
    unit: "KG",
    pricePerUnit: 200,
    subtotal: 1000,
    deliveryCharge: 0,
    platformFee: 0,
    farmerSupportFee: 0,
    total: 1000
};


/* ==========================================================================
   FORMAT RUPEES
   ========================================================================== */

function formatRupees(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
}


/* ==========================================================================
   LOAD ORDER
   ========================================================================== */

function loadOrder() {
    try {
        const raw = localStorage.getItem("bkOrder");

        if (!raw) {
            return FALLBACK_ORDER;
        }

        const parsed = JSON.parse(raw);

        return {
            ...FALLBACK_ORDER,
            ...parsed
        };

    } catch (error) {
        console.warn("Could not read saved order:", error);
        return FALLBACK_ORDER;
    }
}


/* ==========================================================================
   RENDER ORDER
   ========================================================================== */

function renderOrder(order) {

    const itemImage = document.getElementById("itemImage");
    const itemName = document.getElementById("itemName");
    const itemSeller = document.getElementById("itemSeller");
    const itemLocation = document.getElementById("itemLocation");
    const itemQty = document.getElementById("itemQty");
    const itemPrice = document.getElementById("itemPrice");
    const itemSubtotal = document.getElementById("itemSubtotal");

    const sumProduct = document.getElementById("sumProduct");
    const sumDelivery = document.getElementById("sumDelivery");
    const sumPlatform = document.getElementById("sumPlatform");
    const sumFarmerFee = document.getElementById("sumFarmerFee");
    const sumTotal = document.getElementById("sumTotal");


    if (itemImage) {
        itemImage.src = order.productImage || "";
        itemImage.alt = order.productName || "Product";
    }

    if (itemName) {
        itemName.textContent = order.productName || "";
    }

    if (itemSeller) {
        itemSeller.textContent = order.sellerName || "";
    }

    if (itemLocation) {
        itemLocation.textContent = order.sellerLocation || "";
    }

    if (itemQty) {
        itemQty.textContent =
            `${order.quantity || 0} ${order.unit || ""}`;
    }

    if (itemPrice) {
        itemPrice.textContent =
            `${formatRupees(order.pricePerUnit)} / ${order.unit || ""}`;
    }

    if (itemSubtotal) {
        itemSubtotal.textContent =
            formatRupees(order.subtotal);
    }

    if (sumProduct) {
        sumProduct.textContent =
            formatRupees(order.subtotal);
    }

    if (sumDelivery) {
        sumDelivery.textContent =
            formatRupees(order.deliveryCharge);
    }

    if (sumPlatform) {
        sumPlatform.textContent =
            formatRupees(order.platformFee);
    }

    if (sumFarmerFee) {
        sumFarmerFee.textContent =
            formatRupees(order.farmerSupportFee);
    }

    if (sumTotal) {
        sumTotal.textContent =
            formatRupees(order.total);
    }
}


/* ==========================================================================
   ADDRESS ELEMENTS
   ========================================================================== */

const addressModal =
    document.getElementById("addressModal");

const addressModalTitle =
    document.getElementById("addressModalTitle");

const addressForm =
    document.getElementById("addressForm");

const closeAddressModal =
    document.getElementById("closeAddressModal");

const addressVillage =
    document.getElementById("addressVillage");

const addressDistrict =
    document.getElementById("addressDistrict");

const addressState =
    document.getElementById("addressState");

const addressPincode =
    document.getElementById("addressPincode");

const changeAddressBtn =
    document.getElementById("changeAddressBtn");

const addAddressBtn =
    document.getElementById("addAddressBtn");

const continueBtn =
    document.getElementById("continueBtn");


/* ==========================================================================
   ADDRESS STATE
   ========================================================================== */

let addressMode = "edit";

let savedAddresses = {
    address: null,
    address2: null
};


/*
   IMPORTANT:
   selectedAddressKey tells us which address user selected.

   "address"  = HOME / first address
   "address2" = OTHER / second address
*/

let selectedAddressKey =
    localStorage.getItem("bkSelectedAddressKey") || "address";


/* ==========================================================================
   GET SELECTED ADDRESS
   ========================================================================== */

function getSelectedAddress() {

    if (!savedAddresses) {
        return null;
    }

    return savedAddresses[selectedAddressKey] || null;
}


/* ==========================================================================
   SELECT ADDRESS
   ========================================================================== */

function selectAddress(addressKey) {

    if (!savedAddresses[addressKey]) {
        return;
    }

    selectedAddressKey = addressKey;

    /*
       Save selection so payment/order page can also use it.
    */
    localStorage.setItem(
        "bkSelectedAddressKey",
        selectedAddressKey
    );

    console.log(
        "SELECTED ADDRESS:",
        selectedAddressKey,
        savedAddresses[selectedAddressKey]
    );

    /*
       Re-render so selected card gets selected class.
    */
    renderAddresses(savedAddresses);
}


/* ==========================================================================
   LOAD ADDRESSES FROM DATABASE
   ========================================================================== */

async function loadAddresses() {

    const addressList =
        document.getElementById("addressList");

    if (!addressList) {
        console.warn("addressList element not found.");
        return;
    }

    addressList.innerHTML = `
        <div class="address-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Loading address...</span>
        </div>
    `;

    try {

        const response = await fetch(
            VIEW_ADDRESS_ENDPOINT,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to load address"
            );
        }

        savedAddresses =
            data.addresses || {
                address: null,
                address2: null
            };


        /*
           If saved selected address doesn't exist anymore,
           automatically select HOME.
        */

        if (
            !savedAddresses[selectedAddressKey]
        ) {
            if (savedAddresses.address) {
                selectedAddressKey = "address";
            }
            else if (savedAddresses.address2) {
                selectedAddressKey = "address2";
            }
            else {
                selectedAddressKey = null;
            }

            if (selectedAddressKey) {
                localStorage.setItem(
                    "bkSelectedAddressKey",
                    selectedAddressKey
                );
            }
        }


        console.log(
            "SAVED ADDRESSES FROM DATABASE:",
            savedAddresses
        );

        console.log(
            "CURRENT SELECTED ADDRESS:",
            selectedAddressKey
        );

        renderAddresses(savedAddresses);

    } catch (error) {

        console.error(
            "LOAD ADDRESS ERROR:",
            error
        );

        addressList.innerHTML = `
            <div class="address-empty">
                <i class="fa-solid fa-location-dot"></i>
                <strong>No address found</strong>
                <p>Please add your delivery address.</p>
            </div>
        `;
    }
}


/* ==========================================================================
   RENDER ADDRESSES
   ========================================================================== */

function renderAddresses(addresses) {

    const addressList =
        document.getElementById("addressList");

    if (!addressList) {
        return;
    }

    addressList.innerHTML = "";


    if (!addresses) {
        showEmptyAddress(addressList);
        return;
    }


    const addressArray = [];


    /* HOME ADDRESS */

    if (
        addresses.address &&
        typeof addresses.address === "object"
    ) {

        addressArray.push({
            key: "address",
            data: addresses.address,
            label: "HOME"
        });
    }


    /* OTHER ADDRESS */

    if (
        addresses.address2 &&
        typeof addresses.address2 === "object"
    ) {

        addressArray.push({
            key: "address2",
            data: addresses.address2,
            label: "OTHER"
        });
    }


    if (addressArray.length === 0) {
        showEmptyAddress(addressList);
        return;
    }


    /* CREATE ADDRESS CARDS */

    addressArray.forEach((item) => {

        const address = item.data;

        const addressCard =
            document.createElement("div");


        /*
           SELECTED CLASS
        */

        addressCard.className =
            "address-item" +
            (
                selectedAddressKey === item.key
                    ? " selected"
                    : ""
            );


        /*
           IMPORTANT:
           Clicking anywhere on card selects it.
        */

        addressCard.addEventListener(
            "click",
            () => {
                selectAddress(item.key);
            }
        );


        /* LOCATION ICON */

        const icon =
            document.createElement("div");

        icon.className =
            "address-item__icon";

        icon.innerHTML =
            `<i class="fa-solid fa-location-dot"></i>`;


        /* CONTENT */

        const content =
            document.createElement("div");

        content.className =
            "address-item__content";


        /* TOP */

        const top =
            document.createElement("div");

        top.className =
            "address-item__top";


        const title =
            document.createElement("h3");

        title.className =
            "address-item__title";

        title.textContent =
            "Delivery Address";


        const badge =
            document.createElement("span");

        badge.className =
            "address-default";

        badge.innerHTML =
            `<i class="fa-solid fa-house"></i> ${item.label}`;


        top.appendChild(title);
        top.appendChild(badge);


        /* SELECTED INDICATOR */

        if (selectedAddressKey === item.key) {

            const selectedBadge =
                document.createElement("span");

            selectedBadge.className =
                "address-selected-badge";

            selectedBadge.innerHTML =
                `<i class="fa-solid fa-check"></i> Selected`;

            top.appendChild(selectedBadge);
        }


        /* ADDRESS TEXT */

        const addressText =
            document.createElement("p");

        addressText.className =
            "address-item__text";


        const village =
            address.village || "";

        const district =
            address.district || "";

        const state =
            address.state || "";

        const pincode =
            address.pincode || "";


        const fullAddress = [
            village,
            district,
            state
        ]
            .filter(Boolean)
            .join(", ");


        addressText.textContent =
            pincode
                ? `${fullAddress} – ${pincode}`
                : fullAddress;


        content.appendChild(top);
        content.appendChild(addressText);


        /* CARD */

        addressCard.appendChild(icon);
        addressCard.appendChild(content);

        addressList.appendChild(addressCard);
    });
}


/* ==========================================================================
   EMPTY ADDRESS
   ========================================================================== */

function showEmptyAddress(addressList) {

    addressList.innerHTML = `
        <div class="address-empty">
            <i class="fa-solid fa-location-dot"></i>
            <strong>No address added yet</strong>
            <p>Click "+ Add New Address" to add one.</p>
        </div>
    `;
}


/* ==========================================================================
   OPEN ADDRESS MODAL
   ========================================================================== */

async function openAddressModal(mode) {

    if (!addressModal || !addressForm) {
        console.warn(
            "Address modal elements not found."
        );
        return;
    }


    addressMode = mode;

    addressForm.reset();


    /* ============================================================
       EDIT MODE
       ============================================================ */

    if (mode === "edit") {

        if (addressModalTitle) {
            addressModalTitle.textContent =
                "Edit Delivery Address";
        }


        /*
           IMPORTANT:
           Do NOT always use savedAddresses.address.

           Use selectedAddressKey.
        */

        let address =
            savedAddresses[selectedAddressKey];


        /*
           If selected address isn't available,
           use HOME as fallback.
        */

        if (!address) {

            if (savedAddresses.address) {

                selectedAddressKey =
                    "address";

                address =
                    savedAddresses.address;

            }
            else if (savedAddresses.address2) {

                selectedAddressKey =
                    "address2";

                address =
                    savedAddresses.address2;
            }
        }


        if (!address) {

            alert(
                "No address found. Please add a new address."
            );

            addressMode = "add";

            if (addressModalTitle) {
                addressModalTitle.textContent =
                    "Add New Address";
            }

        }
        else {

            console.log(
                "EDITING ADDRESS:",
                selectedAddressKey,
                address
            );


            if (addressVillage) {
                addressVillage.value =
                    address.village || "";
            }

            if (addressDistrict) {
                addressDistrict.value =
                    address.district || "";
            }

            if (addressState) {
                addressState.value =
                    address.state || "";
            }

            if (addressPincode) {
                addressPincode.value =
                    address.pincode || "";
            }
        }
    }


    /* ============================================================
       ADD MODE
       ============================================================ */

    else {

        addressMode = "add";

        addressForm.reset();

        if (addressModalTitle) {
            addressModalTitle.textContent =
                "Add New Address";
        }
    }


    /* SHOW MODAL */

    addressModal.style.display = "flex";

    document.body.classList.add(
        "address-modal-open"
    );


    setTimeout(() => {

        if (addressVillage) {
            addressVillage.focus();
        }

    }, 100);
}


/* ==========================================================================
   CLOSE MODAL
   ========================================================================== */

function closeModal() {

    if (!addressModal) {
        return;
    }

    addressModal.style.display =
        "none";

    document.body.classList.remove(
        "address-modal-open"
    );

    if (addressForm) {
        addressForm.reset();
    }
}


/* ==========================================================================
   CHANGE ADDRESS
   ========================================================================== */

if (changeAddressBtn) {

    changeAddressBtn.addEventListener(
        "click",
        () => {

            /*
               Make sure an address is selected.
            */

            if (
                !selectedAddressKey ||
                !savedAddresses[selectedAddressKey]
            ) {

                alert(
                    "Please select an address first."
                );

                return;
            }

            openAddressModal("edit");
        }
    );
}


/* ==========================================================================
   ADD NEW ADDRESS
   ========================================================================== */

if (addAddressBtn) {

    addAddressBtn.addEventListener(
        "click",
        () => {

            openAddressModal("add");

        }
    );
}


/* ==========================================================================
   CLOSE BUTTON
   ========================================================================== */

if (closeAddressModal) {

    closeAddressModal.addEventListener(
        "click",
        closeModal
    );
}


/* ==========================================================================
   CLOSE WHEN CLICK OUTSIDE
   ========================================================================== */

if (addressModal) {

    addressModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === addressModal
            ) {
                closeModal();
            }

        }
    );
}


/* ==========================================================================
   ESCAPE KEY
   ========================================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            addressModal &&
            addressModal.style.display === "flex"
        ) {
            closeModal();
        }

    }
);


/* ==========================================================================
   SAVE ADDRESS
   ========================================================================== */

if (addressForm) {

    addressForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* GET FORM DATA */

            const village =
                addressVillage
                    ? addressVillage.value.trim()
                    : "";

            const district =
                addressDistrict
                    ? addressDistrict.value.trim()
                    : "";

            const state =
                addressState
                    ? addressState.value.trim()
                    : "";

            const pincode =
                addressPincode
                    ? addressPincode.value.trim()
                    : "";


            /* VALIDATION */

            if (
                !village ||
                !district ||
                !state ||
                !pincode
            ) {

                alert(
                    "Please fill all address fields."
                );

                return;
            }


            if (!/^\d{6}$/.test(pincode)) {

                alert(
                    "Please enter a valid 6 digit pincode."
                );

                return;
            }


            const addressData = {
                village,
                district,
                state,
                pincode
            };


            try {

                let response;


                /* ========================================================
                   EDIT
                   ======================================================== */

                if (addressMode === "edit") {

                    /*
                       VERY IMPORTANT:

                       Send addressKey to backend.

                       address  = HOME
                       address2 = OTHER
                    */

                    const editData = {
                        ...addressData,
                        addressKey: selectedAddressKey
                    };


                    console.log(
                        "UPDATING ADDRESS:",
                        editData
                    );


                    response = await fetch(
                        EDIT_ADDRESS_ENDPOINT,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            credentials: "include",

                            body:
                                JSON.stringify(
                                    editData
                                )
                        }
                    );
                }


                /* ========================================================
                   ADD
                   ======================================================== */

                else {

                    response = await fetch(
                        ADD_ADDRESS_ENDPOINT,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            credentials: "include",

                            body:
                                JSON.stringify(
                                    addressData
                                )
                        }
                    );
                }


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        (
                            addressMode === "edit"
                                ? "Failed to update address"
                                : "Failed to add address"
                        )
                    );
                }


                /* SUCCESS */

                alert(
                    addressMode === "edit"
                        ? "Address updated successfully!"
                        : "New address added successfully!"
                );


                closeModal();


                /*
                   Refresh database data.
                */

                await loadAddresses();

            }
            catch (error) {

                console.error(
                    "ADDRESS ERROR:",
                    error
                );

                alert(
                    error.message ||
                    "Something went wrong while saving address."
                );
            }

        }
    );
}


/* ==========================================================================
   CONTINUE TO PAYMENT
   ========================================================================== */

if (continueBtn) {

    continueBtn.addEventListener(
        "click",
        () => {

            /*
               MUST HAVE SELECTED ADDRESS
            */

            if (
                !selectedAddressKey ||
                !savedAddresses[selectedAddressKey]
            ) {

                alert(
                    "Please select a delivery address first."
                );

                return;
            }


            const selectedAddress =
                savedAddresses[selectedAddressKey];


            console.log(
                "FINAL SELECTED ADDRESS:",
                selectedAddressKey,
                selectedAddress
            );


            /*
               Save order.
            */

            const order =
                loadOrder();


            /*
               Add selected delivery address
               to order object.
            */

            order.deliveryAddress =
                selectedAddress;

            order.selectedAddressKey =
                selectedAddressKey;


            localStorage.setItem(
                "bkOrder",
                JSON.stringify(order)
            );


            /*
               Also save separately.
            */

            localStorage.setItem(
                "bkSelectedAddress",
                JSON.stringify(
                    selectedAddress
                )
            );


            localStorage.setItem(
                "bkSelectedAddressKey",
                selectedAddressKey
            );


            console.log(
                "ORDER GOING TO PAYMENT:",
                order
            );


            window.location.href =
                "/payment";
        }
    );
}


/* ==========================================================================
   INITIAL LOAD
   ========================================================================== */

const order =
    loadOrder();

renderOrder(order);

loadAddresses();