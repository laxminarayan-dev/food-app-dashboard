"use client";

import { Fragment, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

export default function OrdersTable({
  orders,
  riders = [],
  onStatusChange = () => {},
  onAssignRider = () => {},
}) {
  const [openOrderId, setOpenOrderId] = useState(null);
  console.log("OrdersTable rendered with orders:", openOrderId);
  const getStatusColor = (status) => {
    switch (status) {
      case "placed":
        return "secondary";
      case "ready":
        return "default";
      case "out-for-delivery":
        return "outline";
      case "delivered":
        return "default";
      case "canceled":
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={"w-40 text-center"}>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assign Rider</TableHead>
            <TableHead>Change Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <Fragment key={order._id}>
              <TableRow>
                <TableCell className="text-center w-40">
                  {order._id.slice(-6)}
                </TableCell>

                <TableCell>{formatDate(order.createdAt)}</TableCell>

                <TableCell>₹{order.totalAmount}</TableCell>

                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Select
                    defaultValue={order.riderInfo?._id}
                    onValueChange={(riderId) =>
                      onAssignRider(order._id, riderId)
                    }
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Assign Rider" />
                    </SelectTrigger>

                    <SelectContent>
                      {riders.map((rider) => (
                        <SelectItem key={rider._id} value={rider._id}>
                          {rider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(status) =>
                      onStatusChange(order._id, status)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="placed">Placed</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="out-for-delivery">
                        Out for delivery
                      </SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="p-0">
                  <button
                    type="button"
                    className="p-0 h-8 w-8 flex items-center justify-center"
                    onClick={() =>
                      setOpenOrderId(
                        openOrderId === order._id ? null : order._id,
                      )
                    }
                    aria-expanded={openOrderId === order._id}
                    aria-controls={`order-details-${order._id}`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-all duration-300 ${openOrderId === order._id ? "rotate-180" : ""}`}
                    />
                  </button>
                </TableCell>
              </TableRow>

              <TableRow id={`order-details-${order._id}`} className="bg-muted">
                <TableCell colSpan={7} className="p-0 border-none">
                  <div
                    className={`
        overflow-hidden transition-all duration-300
        ${
          openOrderId === order._id
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }
      `}
                  >
                    <div className="py-4 px-10">
                      <div className="font-semibold mb-2">Order Items</div>

                      {order.orderItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between text-sm py-1"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>

                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
