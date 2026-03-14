"""
Order Processing System - Python Demo Script
A sample script with ample variables for debugging demonstration
"""

import json
from datetime import datetime
from typing import Dict, List, Optional


class Product:
    def __init__(self, product_id: str, name: str, price: float, stock: int, category: str):
        self.product_id = product_id
        self.name = name
        self.price = price
        self.stock = stock
        self.category = category
        self.discount_percentage = 0.0
        self.is_active = True


class Customer:
    def __init__(self, customer_id: str, name: str, email: str, loyalty_tier: str):
        self.customer_id = customer_id
        self.name = name
        self.email = email
        self.loyalty_tier = loyalty_tier
        self.loyalty_points = 0
        self.total_spent = 0.0
        self.address = ""
        self.city = ""
        self.state = ""
        self.zip_code = ""


class OrderItem:
    def __init__(self, product: Product, quantity: int):
        self.product = product
        self.quantity = quantity
        self.unit_price = product.price
        self.item_discount = 0.0


class Order:
    def __init__(self, order_id: str, customer: Customer):
        self.order_id = order_id
        self.customer = customer
        self.items: List[OrderItem] = []
        self.subtotal = 0.0
        self.tax_rate = 0.08
        self.tax_amount = 0.0
        self.shipping_cost = 0.0
        self.discount_amount = 0.0
        self.total = 0.0
        self.status = "pending"
        self.created_at = datetime.now()
        self.shipping_address = ""


def calculate_loyalty_discount(customer_loyalty_tier: str, order_total: float) -> float:
    """Calculate discount based on loyalty tier"""
    discount_rates = {
        "bronze": 0.0,
        "silver": 0.05,
        "gold": 0.10,
        "platinum": 0.15
    }
    return order_total * discount_rates.get(customer_loyalty_tier, 0.0)


def calculate_shipping_cost(item_count: int, order_total: float, customer_state: str) -> float:
    """Calculate shipping cost based on various factors"""
    base_shipping = 5.99
    per_item_fee = 1.50

    # Free shipping for orders over $100
    if order_total >= 100.0:
        base_shipping = 0.0
        per_item_fee = 0.0

    # State-specific adjustments
    state_multipliers = {
        "CA": 1.2,
        "NY": 1.1,
        "TX": 1.0,
        "FL": 1.15,
        "WA": 1.05
    }

    multiplier = state_multipliers.get(customer_state, 1.0)
    shipping_cost = (base_shipping + (item_count * per_item_fee)) * multiplier

    return shipping_cost


def process_order(order: Order) -> Dict:
    """Process an order and return the result"""

    # Calculate subtotal
    subtotal = 0.0
    for item in order.items:
        item_subtotal = item.unit_price * item.quantity
        item_subtotal -= item.item_discount
        subtotal += item_subtotal

    order.subtotal = subtotal

    # Apply loyalty discount
    loyalty_discount = calculate_loyalty_discount(
        order.customer.loyalty_tier,
        subtotal
    )
    order.discount_amount = loyalty_discount

    # Calculate shipping
    item_count = sum(item.quantity for item in order.items)
    shipping_cost = calculate_shipping_cost(
        item_count,
        subtotal - loyalty_discount,
        order.customer.state
    )
    order.shipping_cost = shipping_cost

    # Calculate tax
    taxable_amount = subtotal - loyalty_discount
    tax_amount = taxable_amount * order.tax_rate
    order.tax_amount = tax_amount

    # Calculate total
    order.total = taxable_amount + tax_amount + shipping_cost

    # Update order status
    order.status = "confirmed"

    # Update customer loyalty points
    points_earned = int(order.total)
    order.customer.loyalty_points += points_earned
    order.customer.total_spent += order.total

    # Determine shipping address
    if order.customer.address:
        order.shipping_address = f"{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip_code}"

    return {
        "order_id": order.order_id,
        "customer_name": order.customer.name,
        "customer_email": order.customer.email,
        "items_count": item_count,
        "subtotal": round(subtotal, 2),
        "discount": round(loyalty_discount, 2),
        "shipping": round(shipping_cost, 2),
        "tax": round(tax_amount, 2),
        "total": round(order.total, 2),
        "loyalty_points_earned": points_earned,
        "total_loyalty_points": order.customer.loyalty_points,
        "shipping_address": order.shipping_address,
        "status": order.status
    }


def main():
    """Main function to demonstrate the order processing"""

    # Create sample products
    products = [
        Product("P001", "Wireless Mouse", 29.99, 100, "Electronics"),
        Product("P002", "Mechanical Keyboard", 89.99, 50, "Electronics"),
        Product("P003", "USB-C Hub", 49.99, 75, "Accessories"),
        Product("P004", "Monitor Stand", 39.99, 30, "Furniture"),
        Product("P005", "Webcam HD", 59.99, 40, "Electronics"),
    ]

    # Apply some discounts to products
    products[0].discount_percentage = 10.0  # Mouse 10% off
    products[2].discount_percentage = 15.0  # Hub 15% off

    # Create sample customers
    customers = [
        Customer("C001", "Alice Johnson", "alice@example.com", "gold"),
        Customer("C002", "Bob Smith", "bob@example.com", "silver"),
        Customer("C003", "Carol Williams", "carol@example.com", "platinum"),
        Customer("C004", "David Brown", "david@example.com", "bronze"),
    ]

    # Set customer addresses
    customers[0].address = "123 Main St"
    customers[0].city = "San Francisco"
    customers[0].state = "CA"
    customers[0].zip_code = "94102"

    customers[1].address = "456 Oak Ave"
    customers[1].city = "New York"
    customers[1].state = "NY"
    customers[1].zip_code = "10001"

    customers[2].address = "789 Pine Rd"
    customers[2].city = "Seattle"
    customers[2].state = "WA"
    customers[2].zip_code = "98101"

    customers[3].address = "321 Elm St"
    customers[3].city = "Austin"
    customers[3].state = "TX"
    customers[3].zip_code = "73301"

    # Create sample orders
    orders = []

    # Order 1: Alice's order (gold tier, CA)
    order1 = Order("ORD-001", customers[0])
    order1.items.append(OrderItem(products[0], 2))  # 2 Wireless Mice
    order1.items.append(OrderItem(products[1], 1))  # 1 Keyboard
    orders.append(order1)

    # Order 2: Bob's order (silver tier, NY)
    order2 = Order("ORD-002", customers[1])
    order2.items.append(OrderItem(products[2], 3))  # 3 USB-C Hubs
    order2.items.append(OrderItem(products[4], 1))  # 1 Webcam
    orders.append(order2)

    # Order 3: Carol's order (platinum tier, WA)
    order3 = Order("ORD-003", customers[2])
    order3.items.append(OrderItem(products[1], 2))  # 2 Keyboards
    order3.items.append(OrderItem(products[3], 1))  # 1 Monitor Stand
    orders.append(order3)

    # Process all orders
    print("=" * 60)
    print("ORDER PROCESSING SYSTEM - PYTHON DEMO")
    print("=" * 60)

    for order in orders:
        print(f"\nProcessing Order: {order.order_id}")
        print(f"Customer: {order.customer.name} ({order.customer.loyalty_tier} tier)")
        print(f"State: {order.customer.state}")

        result = process_order(order)

        print(f"Items: {result['items_count']}")
        print(f"Subtotal: ${result['subtotal']}")
        print(f"Discount: -${result['discount']}")
        print(f"Shipping: ${result['shipping']}")
        print(f"Tax: ${result['tax']}")
        print(f"TOTAL: ${result['total']}")
        print(f"Points Earned: {result['loyalty_points_earned']}")
        print(f"Total Points: {result['total_loyalty_points']}")
        print(f"Status: {result['status']}")
        print("-" * 40)

    print("\n" + "=" * 60)
    print("ALL ORDERS PROCESSED SUCCESSFULLY")
    print("=" * 60)

    # Return summary for debugging
    return {
        "total_orders": len(orders),
        "total_revenue": sum(o.total for o in orders),
        "total_items": sum(sum(item.quantity for item in o.items) for o in orders)
    }


if __name__ == "__main__":
    breakpoint()
    summary = main()
    print(f"\nSummary: {summary}")
