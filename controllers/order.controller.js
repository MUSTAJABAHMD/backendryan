import Order from "../models/Order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { cart, billing } = req.body;

    console.log("cart",cart);
    console.log("biling",billing);

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

   const items = cart.map((item) => {
  if (!item.product?.productId) {
    throw new Error("Product ID missing in cart item");
  }

  const price = parseFloat(
    item.product.newPrice.replace(/[^0-9.]/g, "")
  );

  if (isNaN(price)) {
    throw new Error("Invalid price in cart");
  }

  return {
    productId: item.product.productId, 
    variantType: item.product.purchaseType,
    price,
    quantity: item.quantity                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  };
});



    const totalAmount = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const order = await Order.create({
      items,
      totalAmount,
      paymentStatus: "pending",
      fulfillmentStatus: "none",
      shippingAddress: {
        name: `${billing.firstName} ${billing.lastName}`,
        address1: billing.street,
        city: billing.city,
        country: billing.country,
        postalCode: billing.zip,
        email:billing.email
      }
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search
    } = req.query;

    const query = {};

    // 🔎 Status filter
    if (status) {
      query.paymentStatus = status;
    }

    // 🔎 Search by name or email
    if (search) {
      query.$or = [
        { "shippingAddress.name": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderNumber: `#ORD-${order._id.toString().slice(-6)}`,
      customer: order.shippingAddress?.name || "N/A",
      status: order.paymentStatus,
      date: order.createdAt,
      total: order.totalAmount,
      itemsCount: order.items
    }));

    res.json({
      data: formattedOrders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error("Get orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};