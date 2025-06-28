"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Star, Download, RefreshCw, AlertCircle, Phone, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  // Mock order data - in real app, fetch based on params.id
  const order = {
    id: '1',
    orderNumber: 'SW2024001',
    status: 'delivered',
    items: [
      {
        id: '1',
        name: 'Apple iPhone 15 Pro Max 256GB',
        brand: 'Apple',
        price: 134900,
        quantity: 1,
        image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'smartphone'
      }
    ],
    totalAmount: 134900,
    orderDate: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-20T18:00:00Z',
    actualDelivery: '2024-01-19T16:30:00Z',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Tech Street, Sector 5',
      city: 'Mumbai',
      pincode: '400001',
      phone: '+91 9876543210'
    },
    trackingNumber: 'SW1234567890',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2024-01-15T10:30:00Z',
        description: 'Your order has been placed successfully'
      },
      {
        status: 'Payment Confirmed',
        timestamp: '2024-01-15T10:35:00Z',
        description: 'Payment received and confirmed'
      },
      {
        status: 'Order Confirmed',
        timestamp: '2024-01-15T11:00:00Z',
        description: 'Order confirmed and being prepared'
      },
      {
        status: 'Shipped',
        timestamp: '2024-01-16T14:20:00Z',
        location: 'Mumbai Warehouse',
        description: 'Package shipped from Mumbai warehouse'
      },
      {
        status: 'Out for Delivery',
        timestamp: '2024-01-19T09:00:00Z',
        location: 'Mumbai Local Hub',
        description: 'Package out for delivery'
      },
      {
        status: 'Delivered',
        timestamp: '2024-01-19T16:30:00Z',
        location: 'Mumbai',
        description: 'Package delivered successfully'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'confirmed': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'confirmed': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Order #{order.orderNumber}</h1>
              <p className="text-sm text-muted-foreground">
                Track your order status and delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center glass-card rounded-lg p-6"
        >
          <Badge className={`${getStatusColor(order.status)} text-lg px-4 py-2 mb-4`}>
            {getStatusIcon(order.status)}
            <span className="ml-2 capitalize">{order.status}</span>
          </Badge>
          <p className="text-sm text-muted-foreground">
            {order.status === 'delivered' && order.actualDelivery
              ? `Delivered on ${formatDate(order.actualDelivery)}`
              : `Expected delivery: ${formatDate(order.estimatedDelivery)}`
            }
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-lg p-6"
        >
          <h3 className="font-semibold mb-6">Order Timeline</h3>
          <div className="space-y-4">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-muted'
                  }`} />
                  {index < order.timeline.length - 1 && (
                    <div className="w-px h-8 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.status}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {event.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-lg p-6"
        >
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span>Qty: {item.quantity}</span>
                    <span>•</span>
                    <span className="font-medium">₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-lg p-6"
        >
          <h3 className="font-semibold mb-4">Shipping Address</h3>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.address}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.pincode}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.phone}
            </p>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-lg p-6"
        >
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order Total</span>
              <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment Method</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment Status</span>
              <Badge variant="secondary" className="capitalize">
                {order.paymentStatus}
              </Badge>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tracking Number</span>
                <span className="font-mono">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}