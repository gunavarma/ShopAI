"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Star, Download, RefreshCw, AlertCircle, Phone, MessageSquare, Calendar, Search, Filter, Eye, RotateCcw, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
  };
  trackingNumber?: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  timeline: Array<{
    status: string;
    timestamp: string;
    location?: string;
    description: string;
  }>;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders] = useState<Order[]>([
    {
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
    },
    {
      id: '2',
      orderNumber: 'SW2024002',
      status: 'shipped',
      items: [
        {
          id: '2',
          name: 'Sony WH-1000XM5 Wireless Headphones',
          brand: 'Sony',
          price: 29990,
          quantity: 1,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
          category: 'headphones'
        },
        {
          id: '3',
          name: 'Apple Watch Series 9 GPS 45mm',
          brand: 'Apple',
          price: 42900,
          quantity: 1,
          image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
          category: 'smartwatch'
        }
      ],
      totalAmount: 72890,
      orderDate: '2024-02-01T15:45:00Z',
      estimatedDelivery: '2024-02-05T18:00:00Z',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Tech Street, Sector 5',
        city: 'Mumbai',
        pincode: '400001',
        phone: '+91 9876543210'
      },
      trackingNumber: 'SW1234567891',
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: '2024-02-01T15:45:00Z',
          description: 'Your order has been placed successfully'
        },
        {
          status: 'Payment Confirmed',
          timestamp: '2024-02-01T15:50:00Z',
          description: 'UPI payment received and confirmed'
        },
        {
          status: 'Order Confirmed',
          timestamp: '2024-02-01T16:15:00Z',
          description: 'Order confirmed and being prepared'
        },
        {
          status: 'Shipped',
          timestamp: '2024-02-02T11:30:00Z',
          location: 'Delhi Warehouse',
          description: 'Package shipped from Delhi warehouse'
        }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'confirmed': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'returned': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'confirmed': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'returned': return <RotateCcw className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending': return 20;
      case 'confirmed': return 40;
      case 'shipped': return 70;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      case 'returned': return 0;
      default: return 0;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">My Orders</h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage your orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-lg p-6"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">#{order.orderNumber}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Order Progress</span>
                  <span>{getProgressValue(order.status)}%</span>
                </div>
                <Progress value={getProgressValue(order.status)} className="h-2" />
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.brand}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>₹{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>
                  Deliver to: {order.shippingAddress.city}, {order.shippingAddress.pincode}
                </span>
                {order.estimatedDelivery && (
                  <>
                    <span>•</span>
                    <Calendar className="w-4 h-4" />
                    <span>
                      Expected: {formatDate(order.estimatedDelivery)}
                    </span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Track Order
                </Button>
                
                {order.status === 'delivered' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success('Invoice downloaded')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Invoice
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success('Return request initiated')}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Return
                    </Button>
                  </>
                )}
                
                {order.trackingNumber && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(order.trackingNumber!);
                      toast.success('Tracking number copied');
                    }}
                  >
                    <Package className="w-4 h-4 mr-1" />
                    {order.trackingNumber}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You haven\'t placed any orders yet'
                }
              </p>
              <Button onClick={() => router.push('/')}>Start Shopping</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}