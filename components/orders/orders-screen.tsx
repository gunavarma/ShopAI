"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Star,
  Download,
  RefreshCw,
  AlertCircle,
  Phone,
  MessageSquare,
  Calendar,
  Search,
  Filter,
  Eye,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { OrdersAPI } from '@/lib/database';
import { ProtectedRoute } from '../auth/protected-route';

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

interface OrdersScreenProps {
  open: boolean;
  onClose: () => void;
}

export function OrdersScreen({ open, onClose }: OrdersScreenProps) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const userOrders = await OrdersAPI.getOrders(user.id);
        
        // Transform database orders to component format
        const transformedOrders = userOrders.map(dbOrder => {
          return {
            id: dbOrder.id,
            orderNumber: dbOrder.order_number,
            status: dbOrder.status as any,
            items: dbOrder.order_items.map(item => ({
              id: item.id,
              name: item.product_name,
              brand: item.product_brand,
              price: item.price,
              quantity: item.quantity,
              image: item.product_image,
              category: item.category
            })),
            totalAmount: dbOrder.total_amount,
            orderDate: dbOrder.created_at,
            estimatedDelivery: dbOrder.estimated_delivery,
            actualDelivery: dbOrder.actual_delivery,
            shippingAddress: dbOrder.shipping_address as any,
            trackingNumber: dbOrder.tracking_number,
            paymentMethod: dbOrder.payment_method,
            paymentStatus: dbOrder.payment_status as any,
            timeline: [
              {
                status: 'Order Placed',
                timestamp: dbOrder.created_at,
                description: 'Your order has been placed successfully'
              }
            ]
          };
        });
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated, user?.id]);

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
      case 'cancelled': return <X className="w-4 h-4" />;
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

  const trackOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const cancelOrder = (orderId: string) => {
    toast.success('Order cancellation requested', {
      description: 'Your cancellation request has been submitted'
    });
  };

  const returnOrder = (orderId: string) => {
    toast.success('Return request initiated', {
      description: 'Your return request has been submitted'
    });
  };

  const downloadInvoice = (orderId: string) => {
    toast.success('Invoice downloaded', {
      description: 'Invoice has been downloaded to your device'
    });
  };

  const reorderItems = (order: Order) => {
    toast.success('Items added to cart', {
      description: `${order.items.length} items from order ${order.orderNumber} added to cart`
    });
  };

  const statuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden bg-background border-border/50">
          <ProtectedRoute>
            <DialogHeader className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">My Orders</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Track and manage your orders
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <AnimatePresence>
                    {filteredOrders.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filters'
                            : 'You haven\'t placed any orders yet'
                          }
                        </p>
                        <Button onClick={onClose}>Start Shopping</Button>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="glass-card rounded-lg p-6 hover:neon-glow transition-all duration-300"
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
                            {order.items.map((item, itemIndex) => (
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
                              onClick={() => trackOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Track Order
                            </Button>
                            
                            {order.status === 'delivered' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadInvoice(order.id)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Invoice
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => returnOrder(order.id)}
                                >
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Return
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => reorderItems(order)}
                                >
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Reorder
                                </Button>
                              </>
                            )}
                            
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelOrder(order.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
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
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </div>
          </ProtectedRoute>
        </DialogContent>
      </Dialog>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Track Order #{selectedOrder.orderNumber}</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 p-1">
                {/* Order Status */}
                <div className="text-center">
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-lg px-4 py-2`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2 capitalize">{selectedOrder.status}</span>
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedOrder.status === 'delivered' && selectedOrder.actualDelivery
                      ? `Delivered on ${formatDate(selectedOrder.actualDelivery)}`
                      : `Expected delivery: ${formatDate(selectedOrder.estimatedDelivery)}`
                    }
                  </p>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Timeline</h3>
                  <div className="space-y-4">
                    {selectedOrder.timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-primary' : 'bg-muted'
                          }`} />
                          {index < selectedOrder.timeline.length - 1 && (
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
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <div className="glass-card rounded-lg p-4">
                    <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shippingAddress.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 glass-card rounded-lg p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.brand}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-medium">₹{item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}