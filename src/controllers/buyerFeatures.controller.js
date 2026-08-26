const productModel = require("../models/products.model");
const orderModel = require("../models/order.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const buyerModel = require("../models/buyer.model");
const cartModel = require("../models/cart.model");

// ============================================================
// BROWSE ALL PRODUCTS
// ============================================================

async function browseProducts(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const data = await productModel.find({
            status: "active"
        });

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products available"
            });
        }

        const products = data.map(product => ({
            productId: product._id,
            sellerName: product.sellerName,
            productImageUri: product.productImageUri,
            productDesc: product.productDesc,
            productQuantity: product.productQuantity,
            productPrice: product.productPrice
        }));

        return res.status(200).json({
            success: true,
            message: "All products fetched successfully",
            products
        });

    } catch (error) {
        console.error("BROWSE PRODUCTS ERROR:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}


// ============================================================
// ORDER PAGE
// ============================================================

async function orderPage(req, res) {
    try {
        const productId = req.params.id;
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const sellerId = product.sellerId;

        if (!sellerId) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        // NOTE:
        // Agar seller alag sellerModel me store hota hai,
        // to yaha buyerModel ki jagah sellerModel use karna hoga.
        const seller = await buyerModel
            .findById(sellerId)
            .select("address");

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller address not found"
            });
        }

        const sellerAddress = seller.address
            ? `${seller.address.village || ""}, ${seller.address.state || ""}`
            : "Address not available";

        return res.status(200).json({
            success: true,
            productImageUri: product.productImageUri,
            productDesc: product.productDesc,
            sellerName: product.sellerName,
            availableQuantity: product.productQuantity,
            price: product.productPrice,
            sellerAddress
        });

    } catch (error) {
        console.error("ORDER PAGE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order page",
            error: error.message
        });
    }
}


// ============================================================
// PLACE ORDER
// ============================================================

async function placeOrder(req, res) {
    try {
        const productId = req.params.id;
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (
            product.status !== "active" ||
            product.productQuantity <= 0
        ) {
            return res.status(409).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        const buyer = await buyerModel.findById(decoded.id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        const { quantity, paymentMethod } = req.body;

        const orderQuantity = Number(quantity);

        if (
            !Number.isInteger(orderQuantity) ||
            orderQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid quantity"
            });
        }

        if (orderQuantity > product.productQuantity) {
            return res.status(409).json({
                success: false,
                message: "Requested quantity is greater than available quantity"
            });
        }

        if (!buyer.address) {
            return res.status(400).json({
                success: false,
                message: "Please add delivery address first"
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Please select a payment method"
            });
        }

        const buyerId = buyer._id;
        const sellerId = product.sellerId;
        const priceAtOrder = product.productPrice;
        const totalAmount = orderQuantity * priceAtOrder;

        // Snapshot of address
        const deliveryAddress = {
            name: buyer.fullName,
            mobileNo: buyer.mobileNo,
            village: buyer.address.village,
            district: buyer.address.district,
            state: buyer.address.state,
            pincode: buyer.address.pincode
        };

        const order = await orderModel.create({
            buyerId,
            sellerId,
            productId: product._id,
            productImageUri: product.productImageUri,
            quantity: orderQuantity,
            priceAtOrder,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            orderStatus: "confirmed"
        });

        // Update product quantity
        product.productQuantity -= orderQuantity;

        // Update order count
        product.orderCount = (product.orderCount || 0) + 1;

        // If stock finished
        if (product.productQuantity === 0) {
            product.status = "inactive";
        }

        await product.save();

        // Remove ordered product from cart if it exists
        const cart = await cartModel.findOne({
            buyerId: decoded.id
        });

        if (cart) {
            cart.items = cart.items.filter(
                item =>
                    item.productId.toString() !== productId.toString()
            );

            await cart.save();
        }

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("PLACE ORDER ERROR:", error);

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
}


// ============================================================
// ADD TO CART
// ============================================================

async function addToCart(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        const productId = req.params.id;
        const quantity = Number(req.body.quantity);

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (
            product.status !== "active" ||
            product.productQuantity <= 0
        ) {
            return res.status(409).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity"
            });
        }

        if (quantity > product.productQuantity) {
            return res.status(409).json({
                success: false,
                message: "Please enter quantity less than available quantity"
            });
        }

        let cart = await cartModel.findOne({
            buyerId: decoded.id
        });

        // Create new cart
        if (!cart) {
            cart = await cartModel.create({
                buyerId: decoded.id,
                items: [
                    {
                        productId: product._id,
                        productImageUri: product.productImageUri,
                        productDesc: product.productDesc,
                        quantity,
                        price: product.productPrice
                    }
                ]
            });

            return res.status(201).json({
                success: true,
                message: "Item added successfully",
                items: cart.items,
                cartCount: cart.items.length
            });
        }

        const alreadyAdded = cart.items.some(
            item =>
                item.productId.toString() === productId.toString()
        );

        if (alreadyAdded) {
            return res.status(409).json({
                success: false,
                message: "Product already added in cart",
                items: cart.items,
                cartCount: cart.items.length
            });
        }

        cart.items.push({
            productId: product._id,
            productImageUri: product.productImageUri,
            productDesc: product.productDesc,
            quantity,
            price: product.productPrice
        });

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Item added successfully",
            items: cart.items,
            cartCount: cart.items.length
        });

    } catch (error) {
        console.error("ADD TO CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
            error: error.message
        });
    }
}


// ============================================================
// DELETE FROM CART
// ============================================================

async function deleteFromCart(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        const productId = req.params.id;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const cart = await cartModel.findOne({
            buyerId: decoded.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const productExists = cart.items.some(
            item =>
                item.productId.toString() === productId.toString()
        );

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        cart.items = cart.items.filter(
            item =>
                item.productId.toString() !== productId.toString()
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            items: cart.items,
            cartCount: cart.items.length
        });

    } catch (error) {
        console.error("DELETE CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from cart",
            error: error.message
        });
    }
}


// ============================================================
// VIEW CART
// ============================================================

async function viewCart(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const cart = await cartModel.findOne({
            buyerId: decoded.id
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                items: [],
                cartCount: 0
            });
        }

        return res.status(200).json({
            success: true,
            items: cart.items || [],
            cartCount: cart.items.length
        });

    } catch (error) {
        console.error("VIEW CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load cart",
            error: error.message
        });
    }
}


// ============================================================
// EDIT ADDRESS
// ============================================================

async function editAddress(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const buyer = await buyerModel.findById(decoded.id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        const { village, district, state, pincode } = req.body;

        if (!village || !district || !state || !pincode) {
            return res.status(400).json({
                success: false,
                message: "All address fields are required"
            });
        }

        buyer.address = {
            village,
            district,
            state,
            pincode
        };

        await buyer.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address: buyer.address
        });

    } catch (error) {
        console.error("EDIT ADDRESS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update address",
            error: error.message
        });
    }
}


// ============================================================
// ADD SECOND ADDRESS
// ============================================================

async function addAddress(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const buyer = await buyerModel.findById(decoded.id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        if (buyer.address2) {
            return res.status(409).json({
                success: false,
                message: "Second address already exists"
            });
        }

        const { village, district, state, pincode } = req.body;

        if (!village || !district || !state || !pincode) {
            return res.status(400).json({
                success: false,
                message: "All address fields are required"
            });
        }

        buyer.address2 = {
            village,
            district,
            state,
            pincode
        };

        await buyer.save();

        return res.status(201).json({
            success: true,
            message: "Second address added successfully",
            address2: buyer.address2
        });

    } catch (error) {
        console.error("ADD ADDRESS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add address",
            error: error.message
        });
    }
}


// ============================================================
// VIEW MY ORDERS
// ============================================================

async function viewOrders(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const orders = await orderModel.find({
            buyerId: decoded.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            message: orders.length
                ? "My orders fetched successfully"
                : "No orders available",
            orders,
            orderCount: orders.length
        });

    } catch (error) {
        console.error("VIEW ORDERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
}


// ============================================================
// VIEW ADDRESSES
// ============================================================

async function viewAddresses(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const buyer = await buyerModel
            .findById(decoded.id)
            .select("fullName mobileNo address address2");

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        return res.status(200).json({
            success: true,
            addresses: {
                address: buyer.address || null,
                address2: buyer.address2 || null
            }
        });

    } catch (error) {
        console.error("VIEW ADDRESSES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch addresses",
            error: error.message
        });
    }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    browseProducts,
    orderPage,
    placeOrder,
    addToCart,
    deleteFromCart,
    viewCart,
    editAddress,
    addAddress,
    viewOrders,
    viewAddresses
};